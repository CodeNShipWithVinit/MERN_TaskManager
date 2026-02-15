const mongoose = require('mongoose');

/**
 * Task Schema
 *
 * Fields:
 *  - title       : String, required
 *  - description : String, required
 *  - status      : Enum ['TODO', 'DONE'], default 'TODO'
 *  - linkedFile  : Blob (Buffer) — stores a PDF; optional
 *  - createdOn   : Date, required, auto-generated
 *  - deadline    : Date, required
 *
 * Virtual:
 *  - displayStatus : computed from status + deadline
 *      'In Progress' — task is TODO and before deadline
 *      'Achieved'    — task is DONE and past deadline
 *      'Failed'      — task is TODO on/after deadline
 */

const linkedFileSchema = new mongoose.Schema(
  {
    data:        { type: Buffer, default: null },
    contentType: { type: String, default: null },
    filename:    { type: String, default: null }
  },
  { _id: false }   // no separate _id for the sub-document
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type:      String,
      required:  [true, 'Description is required'],
      trim:      true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    status: {
      type:    String,
      enum:    {
        values:  ['TODO', 'DONE'],
        message: 'Status must be either TODO or DONE'
      },
      default: 'TODO'
    },
    linkedFile: {
      type:    linkedFileSchema,
      default: null
    },
    createdOn: {
      type:     Date,
      required: true,
      default:  Date.now
    },
    deadline: {
      type:     Date,
      required: [true, 'Deadline is required']
    }
  },
  {
    timestamps: true   // adds createdAt / updatedAt managed by Mongoose
  }
);

// ─── Virtual: displayStatus ────────────────────────────────────────────────
taskSchema.virtual('displayStatus').get(function () {
  const now      = new Date();
  const deadline = new Date(this.deadline);

  if (this.status === 'DONE' && now > deadline) return 'Achieved';
  if (this.status !== 'DONE' && now >= deadline) return 'Failed';
  return 'In Progress';
});

// Include virtuals when converting to JSON / plain object
taskSchema.set('toJSON',   { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
