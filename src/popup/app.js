const text = document.getElementById('find-text')
const p = document.getElementById('find-result')


const sendToTab = async (message) => {
    const activeTab = await browser.tabs.query({active: true, currentWindow: true})
    return browser.tabs.sendMessage(activeTab[0].id, message)
}

text.focus()

// callback when the user types in the text box
text.addEventListener('keyup', (e) => {
    let action = 'filter'
    if (e.key === 'Enter') {
        action = 'goto'
        // select all text in the target input
        text.select()
    }
    const s = sendToTab({action, text: e.target.value})
    p.append(`${e.target.value}`)
    p.appendChild(document.createElement('br'))
})