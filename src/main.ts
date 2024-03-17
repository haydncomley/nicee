import { Button } from './components/button';
import { TestComponent } from './components/test';
import { app, computed, mapper, render, state, store } from './nice'

import './style.css'

export const { storeState } = store({
  name: 'Haydn Comley',
});

app('#app', () => {
  const label = state('Testing Label')
  const count = state(1)
  const name = storeState('name');

  const renderButtons = computed(() => {
    return mapper(count.get(), (i) => Button({ count, extra: count.get() + i }));
  }, [count])
  
  return render`
    <div>
      <span>Label: ${label} ${count}</span>
      <h1>N.I.C.E.</h1>
      
      <h2>Name: ${name}</h2>

      ${TestComponent({ label, count })}
      ${Button({ count, extra: 0 })}
      
      <span>
        ${Button({ count, extra: 0 })}
      </span>

      <div>
        ${renderButtons}
      </div>
    </div>
  `;
});
