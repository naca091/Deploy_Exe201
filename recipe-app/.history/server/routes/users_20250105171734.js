// routes/users.js
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username })
            .select('+password')
            .populate('role');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        user.lastLogin = new Date();
        await user.save();

        const userResponse = {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            address: user.address,
            phone: user.phone,
            coins: user.coins,
            avatar: user.avatar,
            role: user.role,
            lastLogin: user.lastLogin,
        };

        res.json({ success: true, user: userResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});
