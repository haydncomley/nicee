import { TestComponent } from './components/test';
import { app, render, state } from './nice'
import './style.css'
app('#app', () => {
  const label = state('Testing Label')
  
  return render`
    <div>
      <span>Label: ${label}</span>
      <h1>N.I.C.E.</h1>
        ${TestComponent({ label: label })}
    </div>
  `;
});
