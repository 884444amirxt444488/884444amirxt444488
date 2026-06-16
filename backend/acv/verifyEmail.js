const isVerifyEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

module.exports = isVerifyEmail