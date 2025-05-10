export class Chart {
    constructor(data) {
        if (new.target === Chart) {
            throw new TypeError("Cannot construct Chart instances directly");
        }
        this.data = data;
    }
    
    initChart() {
        throw new Error("Method 'initChart()' must be implemented");
    }
    
    updateChart(data) {
        throw new Error("Method 'updateChart()' must be implemented");
    }
    
    destroyChart() {
        throw new Error("Method 'destroyChart()' must be implemented");
    }
}