## Irineu Web - IR Remote Control Hub

Mobile-focused web application for controlling infrared devices via MQTT-connected hubs.

### Installation

```sh
bun install
```

### Database Setup

```sh
# Start PostgreSQL (using Docker Compose)
docker-compose up -d

# Run migrations
bun run db:migrate

# Seed with sample data
bun run db:seed
```

### Environment Configuration

Create a `.env` file with:
```
DATABASE_URL=postgresql://user:pass@localhost:5433/mydb
MQTT_HOST=localhost
MQTT_PORT=1883
MQTT_USERNAME=
MQTT_PASSWORD=
```

### Development

```sh
bun run dev
```

Open http://localhost:3000

### Features

- **Remote Management**: Organize devices by room with pairing codes
- **Device Control**: Support for AC and simple infrared devices  
- **Command Pairing**: Real-time learning of IR commands via MQTT
- **Mobile-First UI**: Responsive design optimized for mobile devices
- **Real-time Updates**: Server-sent events for live pairing feedback

### MQTT Integration

The app listens for IR command data on MQTT topics with the pattern:
```
raw/{pairingCode}/report
```

Expected message format:
```json
{
  "command": "power",
  "irData": "base64_encoded_ir_signal_data"
}
```
