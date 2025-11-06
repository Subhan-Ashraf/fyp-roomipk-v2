import { getCollection } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export class User {
  static collection() {
    return getCollection('users');
  }

  static async create(userData) {
    const { username, email, password } = userData;
    
    // Debug log to help trace create requests
    console.log('👤 Creating user:', { username, email, password: password ? '***' : 'MISSING' });

    // Check if user already exists
    const existingUser = await this.collection().findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('User already exists with this email');
      }
      if (existingUser.username === username) {
        throw new Error('User already exists with this username');
      }
    }

    // Validate password exists
    if (!password) {
      throw new Error('Password is required');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      userType: 'simple_user',
      isVerified: false,
      isActive: true,
      profile: {
        fullName: '',
        age: null,
        gender: '',
        phone: '',
        avatar: null
      },
      // ✅ Initialize hostelOwnerInfo for all users
      hostelOwnerInfo: {
        hostelsOwned: [],
        maxHostelsAllowed: 2,
        canAddMoreHostels: true
      },
      preferences: {
        notifications: true,
        emailUpdates: true
      },
      stats: {
        loginCount: 0,
        lastLogin: null
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection().insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async findByEmail(email) {
    return await this.collection().findOne({ email: email.toLowerCase() });
  }

  static async findByUsername(username) {
    return await this.collection().findOne({ username: username.toLowerCase() });
  }

  static async findById(userId) {
    return await this.collection().findOne({ _id: new ObjectId(userId) });
  }

  static async verifyUser(email) {
    return await this.collection().updateOne(
      { email: email.toLowerCase() },
      { $set: { isVerified: true, updatedAt: new Date() } }
    );
  }

  static async updateLoginStats(userId) {
    return await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { 'stats.loginCount': 1 },
        $set: { 'stats.lastLogin': new Date(), updatedAt: new Date() }
      }
    );
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateProfile(userId, profileData) {
    const updateFields = {};
    
    if (profileData.fullName) updateFields['profile.fullName'] = profileData.fullName;
    if (profileData.age) updateFields['profile.age'] = profileData.age;
    if (profileData.gender) updateFields['profile.gender'] = profileData.gender;
    if (profileData.phone) updateFields['profile.phone'] = profileData.phone;

    return await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...updateFields,
          updatedAt: new Date() 
        } 
      }
    );
  }

  static async upgradeToHostelOwner(userId, ownerData) {
    const { fullName, age, gender, phone } = ownerData;
    
    return await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          userType: 'hostel_owner',
          'profile.fullName': fullName,
          'profile.age': parseInt(age),
          'profile.gender': gender,
          'profile.phone': phone,
          updatedAt: new Date()
        } 
      }
    );
  }

  static async deactivateAccount(userId) {
    return await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );
  }

  // New methods for managing hostels owned by a hostel owner
  static async canAddHostel(userId) {
    const user = await this.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.userType !== 'hostel_owner') {
      throw new Error('User is not a hostel owner');
    }
    
    const currentHostelCount = user.hostelOwnerInfo?.hostelsOwned?.length || 0;
    const maxAllowed = user.hostelOwnerInfo?.maxHostelsAllowed || 2;
    
    return currentHostelCount < maxAllowed;
  }

  static async addHostelToOwner(userId, hostelId) {
    const user = await this.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.userType !== 'hostel_owner') {
      throw new Error('User is not a hostel owner');
    }
    
    const currentHostels = user.hostelOwnerInfo?.hostelsOwned || [];
    const maxAllowed = user.hostelOwnerInfo?.maxHostelsAllowed || 2;
    
    if (currentHostels.length >= maxAllowed) {
      throw new Error(`Hostel owner can only have ${maxAllowed} hostels maximum`);
    }
    
    // Ensure hostelOwnerInfo structure exists and push the new hostel id
    return await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: { 'hostelOwnerInfo.hostelsOwned': hostelId },
        $set: { 
          'hostelOwnerInfo.canAddMoreHostels': currentHostels.length + 1 < maxAllowed,
          updatedAt: new Date()
        }
      },
      { upsert: false }
    );
  }

  static async removeHostelFromOwner(userId, hostelId) {
    return await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { 
        $pull: { 'hostelOwnerInfo.hostelsOwned': hostelId },
        $set: { 
          'hostelOwnerInfo.canAddMoreHostels': true,
          updatedAt: new Date()
        }
      }
    );
  }

  static async getHostelCount(userId) {
    const user = await this.findById(userId);
    return user?.hostelOwnerInfo?.hostelsOwned?.length || 0;
  }
}

