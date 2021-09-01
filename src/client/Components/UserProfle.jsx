import {Form} from 'react-bootstrap';


function UserProfile() {
    return (
        <Form id = "userProfile" align="center">
            <Form.Group>
                <Form.File id="exampleFormControlFile1" label="Upload Your Profile Picture" />
            </Form.Group>
        </Form>
    )
}


export default UserProfile;