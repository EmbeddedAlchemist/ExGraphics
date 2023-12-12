
document.querySelectorAll('.glossy_card').forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const x = e.offsetX,
            y = e.offsetY
        card.style.setProperty('--x', x + 'px')
        card.style.setProperty('--y', y + 'px')
    })
})


document.querySelectorAll('.glossy_btn').forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const x = e.offsetX,
            y = e.offsetY
        card.style.setProperty('--x', x + 'px')
        card.style.setProperty('--y', y + 'px')
        
    })
})