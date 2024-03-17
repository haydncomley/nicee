import { app, computed, render, store } from "../nice";
import { Button } from "./components/button";
import { Menu } from "./components/menu";

export const [ globalStore ] = store({
    isMenuOpen: false,
    name: 'Haydn Comley',
});
  
app('#app', () => {
    const isMenuOpen = globalStore('isMenuOpen');
    
    const toggleMenu = computed<MouseEvent>(() => {
        isMenuOpen.set(!isMenuOpen.get());
    });

    const menuStyles = computed(() => {
        return (isMenuOpen.get() ? 'test' : '');
    }, [isMenuOpen]);

    return render`
        <div class=${menuStyles}>
            ${Menu()}
            
            <h1>N.I.C.E.</h1>
            ${Button({ label: 'Click me!', onClick: toggleMenu })}
        </div>
    `;
});