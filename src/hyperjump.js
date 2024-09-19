/**
 * @let {Object | null} candidate - The current candidate element.
 * @property {HTMLElement} node - The candidate element.
 * @property {number} index - The index of the search text in the candidate element.
 */
let candidate = null;


const indexOf = (text, char, startAt) => {
    for (let i = startAt; i < text.length; i++) {
        if (text[i].toLowerCase() === char) {
            return i
        }
    }
    return -1
}

const simpleSearch = (hayStack, needle) => {
    return hayStack.toLowerCase().indexOf(needle)
}

const fuzzySearch = (hayStack, needle) => {
    let index = 0
    for (let i = 0; i < needle.length; i++) {
        const c = needle[i]
        const oldIndex = indexOf(hayStack, c, index)
        if (oldIndex === -1) {
            // console.log(`${c}:na:"${hayStack}`)
            return -1
        } else if (index - oldIndex > 10) {
            return -1
        }
        index = oldIndex
    }
    // console.log(`${needle}:${index}:"${hayStack}`)
    return index
}

const validNode = (node) => {
    // no scripts, styles, svg, or canvas
    return node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'SVG' && node.tagName !== 'CANVAS'
}

const isNodeVisible = (node) => {
    const style = window.getComputedStyle(node)
    return style.display !== 'none' && style.visibility !== 'hidden'
}

const pushInOrder = (arr, item) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].index >= item.index) {
            arr.splice(i, 0, item)
            return
        }
    }
    arr.push(item)

}

const find = (text) => {
    const dfs = Array.from(document.children)
    const candidates = []
    while (dfs.length > 0) {
        const node = dfs.pop();
        if (validNode(node)) {
            const fuzzyIndex = simpleSearch(node.textContent, text)
            if (fuzzyIndex !== -1) {
                pushInOrder(candidates, {node, index: fuzzyIndex})
                dfs.push(...node.children)
            }
        }
    }
    console.log(candidates)
    for (let i = 0; i < candidates.length; i++) {
        if (isNodeVisible(candidates[i].node)) {
            console.log('adding class', candidate)
            candidate?.node.classList.remove('searcher_candidate')
            candidate = candidates[i]
            candidate.node.classList.add('searcher_candidate')
            candidate.node.scrollIntoView({behavior: 'smooth', block: 'center'})
            console.log('selected', candidates[i].node)
            return
        } else {
            console.log('not visible', candidates[i].node)
        }
    }
    console.log('no candidates')
    candidate?.node.classList.remove('searcher_candidate')
    candidate = null
}

function handleMessage(request, sender, sendResponse) {
    console.log("Message from the background script:");
    console.log(request);
    if (request.action === 'filter' && request.text.length > 3) {
        find(request.text.toLowerCase())
    } else if (request.action === 'goto') {
        if (candidate !== null) {
            candidate.node.click()
        }
    }

    sendResponse({response: "Response from content script"});
}

browser.runtime.onMessage.addListener(handleMessage);