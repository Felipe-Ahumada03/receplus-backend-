const axios = require('axios');
const User = require('../models/User'); // ✅ Importamos tu modelo de Usuario

// Función auxiliar para obtener credenciales
const getAccessToken = async () => {
    const auth = Buffer.from(
        process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET_KEY
    ).toString('base64');

    try {
        const response = await axios.post(
            `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error obteniendo token:", error);
        throw new Error("No se pudo autenticar con PayPal");
    }
};

// 1. CREAR ORDEN
exports.createOrder = async (req, res) => {
    try {
        // Recibimos monto y (opcionalmente) el ID del usuario para rastreo
        const { amount } = req.body;
        const accessToken = await getAccessToken();

        const response = await axios.post(
            `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: amount || '49.99',
                        },
                    },
                ],
                // Configuración para que funcione en el celular
                application_context: {
                    brand_name: "RecePlus",
                    landing_page: "NO_PREFERENCE",
                    user_action: "PAY_NOW",
                    return_url: "https://example.com/return", 
                    cancel_url: "https://example.com/cancel"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error creando orden:", error);
        res.status(500).json({ error: "Error al crear la orden" });
    }
};

// 2. CAPTURAR PAGO Y ACTUALIZAR BD
exports.captureOrder = async (req, res) => {
    const { orderID } = req.params;
    const { userId } = req.body; // ✅ Necesitamos recibir el ID del usuario aquí

    try {
        const accessToken = await getAccessToken();

        // 1. Cobramos el dinero en PayPal
        const response = await axios.post(
            `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // 2. Verificamos si el pago fue exitoso (COMPLETED)
        if (response.data.status === 'COMPLETED') {
            
            // ✅ AQUÍ ESTÁ TU LÓGICA ANTERIOR, PERO SEGURA:
            if (userId) {
                await User.findByIdAndUpdate(userId, { membership: 'premium' });
                console.log(`Usuario ${userId} actualizado a Premium.`);
            }

            return res.json({ 
                status: 'COMPLETED', 
                message: 'Pago exitoso y membresía actualizada', 
                data: response.data 
            });
        }

        // Si no se completó
        res.json({ status: response.data.status, message: 'El pago no se completó' });

    } catch (error) {
        console.error("Error capturando pago:", error);
        res.status(500).json({ error: "Error al capturar el pago" });
    }
};

// 3. CANCELAR
exports.cancelOrder = (req, res) => {
    res.redirect('/');
};