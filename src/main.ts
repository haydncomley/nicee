import { Button } from './components/button';
import { TestComponent } from './components/test';
import { app, render, state } from './nice'
import './style.css'
app('#app', () => {
  const label = state('Testing Label')
  const count = state(1)
  
  return render`
    <div>
      <span>Label: ${label} ${count}</span>
      <h1>N.I.C.E.</h1>
      ${TestComponent({ label, count })}
      ${Button({ count })}
      
      <span>
        ${Button({ count })}
      </span>
    </div>
  `;
});
