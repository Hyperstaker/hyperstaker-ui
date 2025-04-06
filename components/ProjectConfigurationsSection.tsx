import { Table, Badge, Text, Title } from "@mantine/core";

// Updated data structure for single project configuration
const configurations = [
  { 
    name: "Contributor hypercerts transferrable", 
    configValue: { type: "badge", value: "No", color: "red" }, 
  },
  { 
    name: "Single Hypercert for all contributors", 
    configValue: { type: "badge", value: "Yes", color: "green" }, 
  },
  { 
    name: "Percent of a Hypercert for non-financial contributors", 
    configValue: { type: "badge", value: "100%", color: "gray" }, 
  },
  { 
    name: "Do users need to retire Hypercerts when staking to receive retro funding?", 
    configValue: { type: "badge", value: "Yes", color: "green" }, 
  },
  { 
    name: "Multiplier (ratio per token to unit of Hypercert conversion)", 
    configValue: { type: "badge", value: "1 to 1", color: "gray" }, 
  },
];

// renderValue function remains the same, accepting the configValue object or null
function renderValue(value: { type: string; value: string; color: string } | null) {
  if (!value) {
    return <Text>-</Text>; // Display dash for unspecified configurations
  }
  if (value.type === "badge") {
    return <Badge color={value.color} variant="light">{value.value}</Badge>;
  }
  return <Text size="sm">{value.value}</Text>;
}


export function ProjectConfigurationsSection() {
  const rows = configurations.map((config) => (
    <Table.Tr key={config.name}>
      <Table.Td><Text size="sm" c="white">{config.name}</Text></Table.Td>
      <Table.Td>{renderValue(config.configValue)}</Table.Td> 
    </Table.Tr>
  ));

  return (
    <section className="py-20 bg-bg-base">
      <div className="container mx-auto px-4">
        <Title order={3} className="text-center mb-12 text-white">
          Project Configuration Summary
        </Title>
        <div 
          className="p-6 rounded-lg overflow-x-auto"
        > 
          <Table highlightOnHover withTableBorder={false} withColumnBorders={false} className="min-w-[600px]">
            <Table.Thead>
              <Table.Tr>
                <Table.Th><Text c="dimmed">Configuration</Text></Table.Th>
                <Table.Th><Text c="dimmed">Your Selection</Text></Table.Th> 
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </div>
    </section>
  );
} 