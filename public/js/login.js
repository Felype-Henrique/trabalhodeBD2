document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('message').textContent = result.message;
            // Redirecionar ou carregar a página de consulta
        } else {
            document.getElementById('message').textContent = result.message;
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
});
