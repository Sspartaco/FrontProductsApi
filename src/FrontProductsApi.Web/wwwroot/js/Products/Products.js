(() => {
    const modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
    const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    function showAlert(message, type = 'success') {
        const alert = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
        document.getElementById('alertContainer').innerHTML = alert;
        setTimeout(() => {
            const el = document.querySelector('#alertContainer .alert');
            if (el) bootstrap.Alert.getOrCreateInstance(el).close();
        }, 4000);
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(value);
    }

    function formatDate(iso) {
        return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
    }

    function renderRow(p) {
        return `<tr>
            <td class="text-muted small align-middle">${p.id}</td>
            <td class="fw-semibold align-middle">${p.name}</td>
            <td class="text-muted align-middle">${p.description || '<em>Sin descripción</em>'}</td>
            <td class="align-middle">${formatCurrency(p.price)}</td>
            <td class="text-muted small align-middle">${formatDate(p.createdDate)}</td>
            <td class="text-center align-middle">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarProducto(${p.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id}, '${p.name.replace(/'/g, "\\'")}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </button>
            </td>
        </tr>`;
    }

    async function cargarProductos() {
        document.getElementById('loadingSpinner').style.display = '';
        document.getElementById('tableContainer').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';

        const res = await api.get('/Products/GetAll');
        document.getElementById('loadingSpinner').style.display = 'none';

        if (!res.success) return showAlert(res.message, 'danger');

        const productos = res.data;
        if (!productos || productos.length === 0) {
            document.getElementById('emptyState').style.display = '';
            return;
        }

        document.getElementById('productosBody').innerHTML = productos.map(renderRow).join('');
        document.getElementById('tableContainer').style.display = '';
    }

    function resetModal() {
        document.getElementById('productoId').value = '';
        document.getElementById('productoNombre').value = '';
        document.getElementById('productoDescripcion').value = '';
        document.getElementById('productoPrecio').value = '';
        document.getElementById('modalProductoTitle').textContent = 'Nuevo Producto';
    }

    document.getElementById('modalProducto').addEventListener('show.bs.modal', e => {
        if (!e.relatedTarget) return;
        resetModal();
    });

    window.editarProducto = async (id) => {
        const res = await api.get(`/Products/GetById/${id}`);
        if (!res.success) return showAlert(res.message, 'danger');

        const p = res.data;
        document.getElementById('productoId').value = p.id;
        document.getElementById('productoNombre').value = p.name;
        document.getElementById('productoDescripcion').value = p.description || '';
        document.getElementById('productoPrecio').value = p.price;
        document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
        modalProducto.show();
    };

    window.eliminarProducto = (id, name) => {
        document.getElementById('eliminarId').value = id;
        document.getElementById('eliminarNombre').textContent = name;
        modalEliminar.show();
    };

    document.getElementById('btnGuardar').addEventListener('click', async () => {
        const nombre = document.getElementById('productoNombre').value.trim();
        const precio = parseFloat(document.getElementById('productoPrecio').value);

        if (!nombre) return showAlert('El nombre es requerido', 'warning');
        if (!precio || precio <= 0) return showAlert('El precio debe ser mayor a 0', 'warning');

        const dto = {
            name: nombre,
            description: document.getElementById('productoDescripcion').value.trim() || null,
            price: precio
        };

        const id = document.getElementById('productoId').value;
        const spinner = document.getElementById('btnGuardarSpinner');
        spinner.classList.remove('d-none');

        const res = id
            ? await api.put(`/Products/Update/${id}`, dto)
            : await api.post('/Products/Create', dto);

        spinner.classList.add('d-none');

        if (!res.success) return showAlert(res.message, 'danger');

        modalProducto.hide();
        showAlert(res.message);
        cargarProductos();
    });

    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        const id = document.getElementById('eliminarId').value;
        const spinner = document.getElementById('btnEliminarSpinner');
        spinner.classList.remove('d-none');

        const res = await api.delete(`/Products/Delete/${id}`);
        spinner.classList.add('d-none');

        if (!res.success) return showAlert(res.message, 'danger');

        modalEliminar.hide();
        showAlert(res.message);
        cargarProductos();
    });

    cargarProductos();
})();
