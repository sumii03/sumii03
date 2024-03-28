import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { callCloudFunctionWithAppCheck, checkIfUserSubscription, setSubscription, signOut, useAuth } from "../../../../firebaseProvider";
import Text from "../../../Atoms/Text";
import Modal from "react-modal";
import { useRef, useState } from "react";
import Row from "../../../Atoms/Row";
import { useOnClickOutside } from "../../Navigation/utils";

const SignOutButton = styled.button`
  border: 0;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 50px;
  width: fit-content;
  padding: 12px 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const CancelSubscriptionButton = styled.button`
  border: 0;
  cursor: pointer;
  background-color: #bb544d;
  border-radius: 50px;
  width: fit-content;
  padding: 12px 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom :8px;
  @media screen and (max-width: 768px) {
    padding: 10px 15px;
  }
`;
const ConfirmButton = styled.button`
  border: 0;
  cursor: pointer;
  background-color: #bb544d;
  border-radius: 50px;
  width: fit-content;
  padding: 12px 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom :8px;
  @media screen and (max-width: 768px) {
    padding: 10px 15px;
  }
`;
const CancelButton = styled.button`
  border: 0;
  cursor: pointer;
  border-radius: 50px;
  width: fit-content;
  background-color: #fff;
  padding: 12px 20px;
  display: block;
  margin-right:14px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom :8px;
  border:1px solid gray;
  @media screen and (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const Container = styled.div`
cursor: pointer;
margin-top:10px;
display: flex;
justify-content: center;
align-items: center;
@media screen and (max-width: 768px) {
  padding: 10px 15px;
}
`
const Settings = (props) => {
  const node = useRef();

  const { t } = useTranslation();
  const { user } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isSubscription, setIsSubscription] = useState(null);
 // todo: replace with check for subscription status on revenuecat
 if ( user && user?.uid) {
  checkIfUserSubscription(user.uid).then((res) => {
    setIsSubscription(res);
  });
}
  const handleSignOut = () => {
    signOut();
  };

  useOnClickOutside(node, () => {
    setIsOpen(false);
  });

  const CancelSubscription =()=>{
    if(user && user?.uid && user?.subscription){
      callCloudFunctionWithAppCheck("cancelSubscription", {
        subscriptionId:
        isSubscription,
      })
        .then((response) => {
          setIsOpen(false)
          updateUserSubscription()
          
        })
        .catch((error) => {
          setIsOpen(false)
          console.log("Error response", error);
        });
    }else{
      setIsOpen(false)
    }
   
  }
  const updateUserSubscription =()=>{
    if(user && user?.uid){
      setSubscription(user?.uid,false,"")
    }

  }
  

  return (
    <>
    
       {modalIsOpen==true && <div ref={node}><Row justify="center" isRow={true} isRowOnMobile={true}>
        {t("Auth.CancelSubscriptionModalDescription")} 
        </Row>
     <Container>
        
      <CancelButton onClick={()=>setIsOpen(false)}>
        <Text color="#000000" size="13px">
          {t("Auth.CancelSubscriptionCancelButton")}
        </Text>
      </CancelButton>
      <ConfirmButton onClick={()=>{CancelSubscription()}}>
<Text color="#ffffff" size="13px" >
          {t("Auth.CancelSubscription")}
        </Text>
</ConfirmButton>
      </Container></div>}
     {modalIsOpen==false &&<>
      
      <Text size="14px" weight="bold" marginBottom="8px">
        {t("Auth.LoggedInAs")}
      </Text>
      {user && (
        <Text size="14px" marginBottom="20px">
          {user.email}
        </Text>
      )}



{isSubscription &&<CancelSubscriptionButton onClick={()=>{setIsOpen(true)}}>
<Text color="#ffffff" size="13px" >
          {t("Auth.CancelSubscription")}
        </Text>
</CancelSubscriptionButton>}
      <SignOutButton onClick={handleSignOut}>
        <Text color="#ffffff" size="13px">
          {t("Auth.Logout")}
        </Text>
      </SignOutButton>
      </> }
    </>
  );
};

export default Settings;
