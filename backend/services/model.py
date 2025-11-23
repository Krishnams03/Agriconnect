import torch
import torch.nn as nn

class CNN(nn.Module):
    def __init__(self, K):
        super(CNN, self).__init__()
        self.conv_layers = nn.Sequential(
            # conv1
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(2),  # Reduces HxW by 2
            # conv2
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2),  # Reduces HxW by 2
            # conv3
            nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.Conv2d(in_channels=128, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.MaxPool2d(2),  # Reduces HxW by 2
            # conv4
            nn.Conv2d(in_channels=128, out_channels=256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(256),
            nn.Conv2d(in_channels=256, out_channels=256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(256),
            nn.MaxPool2d(2),  # Reduces HxW by 2
            nn.AdaptiveAvgPool2d((1, 1))  # Global average pooling
        )
        
        # Dense layers
        self.dense_layers = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(256, K),  # Input size matches conv output after GAP
        )

    def forward(self, X):
        # Forward pass
        out = self.conv_layers(X)
        out = out.view(out.size(0), -1)  # Flatten for dense layers
        out = self.dense_layers(out)
        return out

# Example usage:
if __name__ == "__main__":
    K = 39  # Number of classes
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')  # Use GPU if available

    model = CNN(K).to(device)  # Move model to the same device
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    # Dummy input for testing
    dummy_input = torch.randn(8, 3, 224, 224).to(device)  # Batch size 8, RGB images 224x224
    output = model(dummy_input)  # Forward pass
    print(output.shape)  # Should be [8, K]
