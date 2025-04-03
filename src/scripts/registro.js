function registrarUsuario(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return false;
    }
    
    // Recuperar usuários existentes
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar se o email já está cadastrado
    if (usuarios.some(u => u.email === email)) {
        alert('Este email já está cadastrado!');
        return false;
    }
    
    // Adicionar novo usuário
    const novoUsuario = {
        id: Date.now(),
        nome,
        email,
        senha,
        tipo: 'usuario' // pode ser 'admin' ou 'usuario'
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Conta criada com sucesso!');
    window.location.href = './login.html';
    return false;
}