const deleteButton = document.getElementById("delete-product")

const deleteProduct = () => {
    const productId = deleteButton.parentNode.querySelector('[name=productId]').value;
    const csrfToken = deleteButton.parentNode.querySelector('[name=_csrf]').value;
    const productElement = deleteButton.closest('article');

    fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {console.log(err)})
}

deleteButton.addEventListener("click", deleteProduct);
