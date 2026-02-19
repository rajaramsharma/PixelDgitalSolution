const Customize = require('../models/Customize');

exports.saveCustomization = async (req, res) => {
    try {
        let { user, product, designImage, backDesignImage, texts, backTexts, logo, backLogo, basePrice, finalPrice } = req.body;

        // Parse JSON strings if coming from FormData (Multipart)
        if (typeof texts === 'string') {
            try { texts = JSON.parse(texts); } catch (e) { }
        }
        if (typeof backTexts === 'string') {
            try { backTexts = JSON.parse(backTexts); } catch (e) { }
        }
        if (typeof logo === 'string') {
            try { logo = JSON.parse(logo); } catch (e) { }
        }
        if (typeof backLogo === 'string') {
            try { backLogo = JSON.parse(backLogo); } catch (e) { }
        }

        const newCustomization = new Customize({
            user: user === 'undefined' || user === 'null' ? null : user,
            product,
            designImage,
            backDesignImage,
            texts,
            backTexts,
            logo,
            backLogo,
            basePrice,
            finalPrice
        });

        const savedCustomization = await newCustomization.save();

        res.status(201).json(savedCustomization);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCustomization = async (req, res) => {
    try {
        const customization = await Customize.findById(req.params.id).populate('product');
        if (!customization) return res.status(404).json({ msg: 'Customization not found' });
        res.json(customization);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Customization not found' });
        res.status(500).send('Server Error');
    }
};
