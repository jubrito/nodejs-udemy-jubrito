const deleteProduct = (deleteButton) => {
    const productId = deleteButton.parentNode.querySelector('[name=productId]').value;
    const csrfToken = deleteButton.parentNode.querySelector('[name=_csrf]').value;
    console.log()
}