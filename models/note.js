const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    noteTitle: {
        type: String,
        required: [true, 'Note title is required']
    },
    noteDescription: {
        type: String,
        required: [true, 'Note description is required']
    },
    priority: {
        type: String,
        enum: ['HIGH', 'LOW'],
        default: 'LOW'
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

// Update the dateUpdated field whenever a note is modified
noteSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

module.exports = mongoose.model('Note', noteSchema);
