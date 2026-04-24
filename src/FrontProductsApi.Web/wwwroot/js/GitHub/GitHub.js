(() => {
    async function buscar() {
        const username = document.getElementById('inputUsername').value.trim();
        if (!username) return;

        const errorEl = document.getElementById('buscarError');
        const perfilCard = document.getElementById('perfilCard');
        const spinner = document.getElementById('buscarSpinner');

        errorEl.style.display = 'none';
        perfilCard.style.display = 'none';
        spinner.classList.remove('d-none');

        const res = await api.get(`/GitHub/GetUser/${encodeURIComponent(username)}`);
        spinner.classList.add('d-none');

        if (!res.success) {
            errorEl.textContent = res.message || 'Usuario no encontrado';
            errorEl.style.display = '';
            return;
        }

        const u = res.data;
        document.getElementById('perfilAvatar').src = u.avatar_url || '';
        document.getElementById('perfilName').textContent = u.name || u.login;
        document.getElementById('perfilLogin').textContent = `@${u.login}`;
        document.getElementById('perfilRepos').textContent = u.public_repos.toLocaleString();
        document.getElementById('perfilFollowers').textContent = u.followers.toLocaleString();
        document.getElementById('perfilLink').href = u.html_url || '#';
        perfilCard.style.display = '';
    }

    document.getElementById('btnBuscar').addEventListener('click', buscar);

    document.getElementById('inputUsername').addEventListener('keydown', e => {
        if (e.key === 'Enter') buscar();
    });
})();
