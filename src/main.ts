import './app.css';
//
import App from './App.svelte';

const app: App = new App({
    target: document.getElementById('app'),
    props: {
        //name: 'Svelte'
    }
});

export default app;
