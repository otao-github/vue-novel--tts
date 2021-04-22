module.exports = {
    devServer: {
        proxy: {
            '/ajax.php': {
                target: 'http://tts.movilrepuestos.es/',
                // target: 'http://localhost/',
                changeOrigin: true,
            },
        }
    }
}