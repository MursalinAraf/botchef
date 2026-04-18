import { Badge, Card, Spin, Typography } from 'antd'
import { useGetHealthQuery } from '@/features/health/healthApi'

const { Title, Text } = Typography

export default function HealthPage() {
  const { data, isLoading, isError } = useGetHealthQuery()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-80 text-center shadow-sm">
        <Title level={3} className="mb-1">
          🍕 BotChef
        </Title>

        <Text type="secondary" className="block mb-6">
          System status
        </Text>

        {isLoading && <Spin size="large" />}

        {isError && (
          <Badge
            status="error"
            text={
              <Text type="danger">
                Backend not reachable — is Rails running on port 3001?
              </Text>
            }
          />
        )}

        {data && (
          <div className="flex flex-col gap-3">
            <Badge
              status="success"
              text={<Text strong>API connected</Text>}
            />
            <div className="bg-gray-50 rounded-lg p-3 text-left text-sm">
              <div className="flex justify-between">
                <Text type="secondary">Status</Text>
                <Text strong>{data.status}</Text>
              </div>
              <div className="flex justify-between mt-1">
                <Text type="secondary">Version</Text>
                <Text strong>{data.version}</Text>
              </div>
              <div className="flex justify-between mt-1">
                <Text type="secondary">Environment</Text>
                <Text strong>{data.environment}</Text>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
