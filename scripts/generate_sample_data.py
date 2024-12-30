import json
import math
import random

def generate_loss_curve(epochs, initial_loss, learning_rate, batch_size, noise_level=0.02):
    """Generate a realistic training loss curve with some noise."""
    curve = []
    current_loss = initial_loss
    
    # Different convergence rates based on learning rate and batch size
    convergence_rate = learning_rate * (64 / batch_size) * 0.5
    
    for epoch in range(1, epochs + 1):
        # Add exponential decay with noise
        decay = math.exp(-convergence_rate * epoch)
        noise = random.uniform(-noise_level, noise_level)
        loss = 0.2 + (initial_loss - 0.2) * decay + noise
        
        curve.append({
            "epoch": epoch,
            "run": f"lr={learning_rate},batch={batch_size}",
            "loss": round(max(0.1, loss), 4)
        })
    
    return curve

# Generate multiple training runs
epochs = 20
data = []

# Configuration combinations
configs = [
    (0.1, 16, 1.0),    # Fast convergence, small batch
    (0.01, 32, 0.9),   # Medium convergence, medium batch
    (0.001, 64, 0.95), # Slow convergence, large batch
    (0.05, 16, 0.85),  # Alternative fast convergence
    (0.005, 32, 0.88)  # Alternative medium convergence
]

for lr, batch_size, initial_loss in configs:
    data.extend(generate_loss_curve(epochs, initial_loss, lr, batch_size))

# Save to JSON file
with open('sample_training_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Generated sample training data with multiple runs")
