const Vendor = require('../models/Vendor');

exports.getAllVendors = async (req, res) => {
    try {
        const { search } = req.query;
        const query = search
            ? { $or: [{ vendorName: { $regex: search, $options: 'i' } }, { vendorCompany: { $regex: search, $options: 'i' } }] }
            : {};
        const data = await Vendor.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getVendor = async (req, res) => {
    try {
        const data = await Vendor.findById(req.params.id);
        if (!data) return res.status(404).json({ success: false, error: 'Vendor not found' });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createVendor = async (req, res) => {
    try {
        const data = await Vendor.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateVendor = async (req, res) => {
    try {
        const data = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ success: false, error: 'Vendor not found' });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteVendor = async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
