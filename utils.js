const getPasswordSize = () => {
  return 6;
};

const getTeams = (team = null) => {
  let teams = ["Dev", "Security", "SysAdmin", "Network", "DBA"];
  if (team) {
    return teams.filter(t => t !== team)
  }
  return teams
};

const getCategories = (team) => {
  switch (team) {
    case "Dev":
      return ["NodeJS", "PHP", "Python", "Java"];
    case "Security":
      return [
        "Social Engineering",
        "Network Scanning",
        "Exploitation",
        "Password Cracking"
      ];
    case "SysAdmin":
      return ["Linux", "Windows Server", "Ansible", "CLI"];
    case "Network":
      return ["Cisco", "DNS", "DHCP", "TCP IP"];
    case "DBA":
      return ["ORACLE", "MySQL", "PostgreSQL", "Mongodb"];
  }
};

module.exports = { getCategories, getTeams, getPasswordSize };
