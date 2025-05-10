export class Counter {
  constructor() {
    this.count = 0;
  }
  

    countUp({from, to, duration, id}) {
        this.count = from;
        const step = (to - from) / 100; // We'll update 100 times during the animation
        const updateInterval = duration / 100;
        
        const interval = setInterval(() => {
            this.count += step;
            this.updateDisplay(id);
            
            if ((step > 0 && this.count >= to) || (step < 0 && this.count <= to)) {
                clearInterval(interval);
                this.count = to;
                this.updateDisplay(id);
            }
        }, updateInterval);
    }
    
    updateDisplay(id) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = Math.round(this.count);
        }
    }
}