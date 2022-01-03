const getPasswordSize = () => {
  return 6
}
const getTeams = (team = null) => {
  let teams = ["Dev", "Security", "SysAdmin", "Network", "DBA"]
  if (team) {
    return teams.filter(t => t !== team)
  }
  return teams
}
const getCategories = team => {
  switch (team) {
    case "Dev":
      return ["NodeJS", "PHP", "Python", "Java"]
    case "Security":
      return [
        "Social Engineering",
        "Network Scanning",
        "Binary Exploitation",
        "Password Cracking"
      ]
    case "SysAdmin":
      return ["Bash", "Powershell", "Ansible", "Docker"]
    case "Network":
      return ["Cisco", "IPv4/IPv6", "Switching", "Routing"]
    case "DBA":
      return ["Oracle", "MySQL", "PostgreSQL", "Mongodb"]
  }
}
const parseMessage = (user, message) => {
  return {
    user,
    time: new Date().toLocaleTimeString(),
    message
  }
}

let connectedUsers = []

const getUsers = room => {
  return connectedUsers.filter(user => user.room === room)
}
const joinUser = (id, name, room) => {
  connectedUsers.push({
    id,
    name,
    room
  })
}
const leaveUser = id => {
  let user = connectedUsers.filter(user => user.id === id)[0]
  connectedUsers = connectedUsers.filter(user => user.id !== id)
  return user
}

module.exports = {
  getCategories,
  getTeams,
  getPasswordSize,
  parseMessage,
  joinUser,
  leaveUser,
  getUsers
}
