import { Form } from "antd";

const CampaignModalContent = ({form}) => {
    
    const onFinish = (values) => {
      
    }
    

    return (
        <div className="flex flex-col w-full h-full gap-4">
            <Form form={form} onFinish={onFinish}>
                <Form.Item>

                </Form.Item>
            </Form>
        </div>
    )
}


export default CampaignModalContent;
