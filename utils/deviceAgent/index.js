import axios from 'axios'

// The local device agent (magnit-device-agent) exposes the stable machine
// identifier on its scale server. CORS there is permissive, so the browser
// can read it directly. Override the URL with VITE_DEVICE_AGENT_URL.
const DEVICE_AGENT_URL = import.meta.env.VITE_DEVICE_AGENT_URL || 'http://localhost:9200'

// fetchMachineId returns the machine GUID reported by the local device agent.
// Throws if the agent is unreachable or returns an empty id — the caller is
// expected to block login and show a "device unavailable" message.
export async function fetchMachineId({ timeout = 4000 } = {}) {
  const { data } = await axios.get(`${DEVICE_AGENT_URL}/machine-id`, { timeout })
  const machineId = data?.machineId
  if (!machineId) {
    throw new Error('device agent returned an empty machineId')
  }
  return machineId
}
