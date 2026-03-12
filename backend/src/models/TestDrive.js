import mongoose from 'mongoose';

const testDriveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please provide preferred date'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please provide preferred time'],
    },
    alternateDate: Date,
    alternateTime: String,
    contactName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    confirmedDate: Date,
    confirmedTime: String,
    notes: {
      customer: String,
      dealer: String,
      internal: String,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
testDriveSchema.index({ user: 1 });
testDriveSchema.index({ car: 1 });
testDriveSchema.index({ dealer: 1 });
testDriveSchema.index({ status: 1 });
testDriveSchema.index({ preferredDate: 1 });
testDriveSchema.index({ createdAt: -1 });

const TestDrive = mongoose.model('TestDrive', testDriveSchema);

export default TestDrive;
