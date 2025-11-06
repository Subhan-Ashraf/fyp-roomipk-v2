import { getCollection } from '../config/database.js';

export class VerificationCode {
  static collection() {
    return getCollection('verification_codes');
  }

  static async create(email, code) {
    const verificationCode = {
      email: email.toLowerCase(),
      code,
      attempts: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 8 * 60 * 1000) // 8 minutes
    };

    // Remove any existing codes for this email
    await this.collection().deleteMany({ email: email.toLowerCase() });

    await this.collection().insertOne(verificationCode);
    return verificationCode;
  }

  static async findByEmail(email) {
    // ✅ MANUAL EXPIRATION CLEANUP: remove any expired codes before querying
    await this.collection().deleteMany({
      expiresAt: { $lt: new Date() }
    });

    return await this.collection().findOne({
      email: email.toLowerCase(),
      expiresAt: { $gt: new Date() }
    });
  }

  static async incrementAttempts(email) {
    return await this.collection().updateOne(
      { email: email.toLowerCase() },
      { $inc: { attempts: 1 } }
    );
  }

  static async deleteCode(email) {
    return await this.collection().deleteMany({ email: email.toLowerCase() });
  }
}