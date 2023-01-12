export function draggable(node: HTMLElement, { offset }: {offset: number}): {destroy:()=>void} {
    // onMount
    let _offset: number = offset;
    let x: number = 0;
    let y: number = 0;

    function handleMousedown(ev: MouseEvent) {
        x = ev.clientX + _offset;
        y = ev.clientY + _offset;
        
        node.dispatchEvent(
            new CustomEvent('dragstart', {detail: {x, y}})
        );

        window.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mouseup', handleMouseup)
    }

    function handleMousemove(ev: MouseEvent) {
        const dx = ev.clientX - x;
        const dy = ev.clientY - y;
    
        x = ev.clientX;
        y = ev.clientY;
    
        node.dispatchEvent(
            new CustomEvent('drag', {detail: {x, y, dx, dy}})
        );
    }

    function handleMouseup(ev: MouseEvent) {
        x = ev.clientX + _offset;
        y = ev.clientY + _offset;

        node.dispatchEvent(
            new CustomEvent('dragend', {detail: {x, y}})
        );

        window.removeEventListener('mousemove', handleMousemove)
        window.removeEventListener('mouseup', handleMouseup);
    }

    node.addEventListener('mousedown', handleMousedown);

    return {
        destroy() {
          // onDestroy
          node.removeEventListener('mousedown', handleMousedown)
        }
    }
}
