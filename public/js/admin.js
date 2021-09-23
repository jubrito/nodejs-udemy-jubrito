const deleteProduct = (deleteButton) => {
    const productId = deleteButton.parentNode.querySelector('[name=productId]').value;
    const csrfToken = deleteButton.parentNode.querySelector('[name=_csrf]').value;

    fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    }).then(result => {
        console.log(result);
    }).catch(err => {console.log(err)})
}