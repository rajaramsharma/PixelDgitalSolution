const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Create a category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        // Simple slug generation
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const category = new Category({
            name,
            slug,
            description,
            icon: icon || 'Tag'
        });

        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error("Create category error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, icon, isActive } = req.body;
        const slug = name ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : undefined;

        const updateData = { description, icon, isActive };
        if (name) {
            updateData.name = name;
            updateData.slug = slug;
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true } // validaton added
        );

        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        console.error("Update category error:", error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Delete category error:", error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        res.status(500).json({ message: error.message });
    }
};
