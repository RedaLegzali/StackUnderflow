const getPasswordSize = () => {
  return 6;
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

module.exports = { getCategories, getPasswordSize };
