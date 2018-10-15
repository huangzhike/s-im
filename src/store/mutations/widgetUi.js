export function updateLoading(state, status) {
    clearTimeout(state.loadingTimer)
    state.loadingTimer = setTimeout(() => state.isLoading = status, 20)
}


export function updateFullscreenImage(state, obj) {
    obj = obj || {}
    if (obj.src && obj.type === 'show') {
        state.fullscreenImgSrc = obj.src
        state.isFullscreenImgShow = true
    } else if (obj.type === 'hide') {
        state.fullscreenImgSrc = ' '
        state.isFullscreenImgShow = false
    }
}

