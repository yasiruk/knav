let candidate = null;
const find = (text) => {
    const anchors = Array.from(document.querySelectorAll('a'))
        .map((a) => {
            return {
                node: a,
                index: a.innerText.toLowerCase().indexOf(text.toLowerCase())
            }
        })
        .filter((a) => a.index !== -1)
        .sort((a, b) => a.index - b.index)


    console.log(candidate, anchors)
    if (candidate !== null) {
        // remove the highlight css class
        candidate.classList.remove('searcher_candidate')
    }

    candidate = anchors[0]?.node ?? null
    // add the highlight css class
    if (candidate !== null) {
        candidate.classList.add('searcher_candidate')
        console.log('adding class', candidate)
        candidate.scrollIntoView({behavior: 'smooth', block: 'center'})
    }
    return anchors
}

function handleMessage(request, sender, sendResponse) {
    console.log("Message from the background script:");
    console.log(request);
    if (request.action === 'filter') {
        find(request.text)
    } else if (request.action === 'goto') {
        if (candidate !== null) {
            candidate.click()
        }
    }
    sendResponse({response: "Response from content script"});
}

browser.runtime.onMessage.addListener(handleMessage);