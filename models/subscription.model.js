import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR"],
        default: "USD"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"]
    },
    category: {
        type: String,
        enum: ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"],
        default: "other",
        required: [true, "Category is required"]
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, "Payment method is required"]
    },
    status: {
        type: String,
        enum: ["active", "canceled", "expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start date cannot be in the future"
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value > this.startDate;
            },
            message: "Renewal date must be after start date"
            }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
        index: true
    }
}, { timestamps: true });

subscriptionSchema.pre("save", function(next) {
    if (this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;