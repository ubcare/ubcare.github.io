---
layout: post
title: "실시간 데이터베이스 사용기 (Fireabase) 2탄"
date: 2019-03-11
author: 이현진
categories: Post
//tag : mobile, firebase, database
cover: "/assets/connection.jpg"
---

2탄으로 돌아왔습니다.<br>
![](/assets/posting/20190304/1.png)
오늘은 제가 운영 중인 앱의 **버전 체크 및 업데이트 기능**을 Fireabse Realtime database를 이용하여 구현한 사례를 공유합니다. 
<br>
<br>
<br>
**[💡️ 다시보기 - 실시간 데이터베이스 사용기 (Fireabase) 1탄](/post/2019/03/04/firebase-realtimedatabase.html){: target="blank"}**
<br>
<br>
<br>


 

#### 1. [Google Firebase Console](https://console.firebase.google.com){: target="blank"}에 프로젝트를 생성합니다.
![](/assets/posting/20190311/1.png){: width="100%" height="100%"}
<br>
<br>

#### 2. 개발 > Database를 선택하고 Realtime Database를 만듭니다.
데이터베이스보다 한 단계 진화된 Firestore를 써보고 싶지만 다음에 하기로 합니다. 
![](/assets/posting/20190311/2.png){: width="100%" height="100%"}
<br>
<br>

#### 3. 데이터베이스 보안 규칙을 생성합니다. 읽고 쓰는 것에 대한 거부를 설정할 수 있습니다.
![](/assets/posting/20190311/3.png){: width="120%" height="120%"}
<br>
<br>

#### 4. 새 데이터베이스가 만들어졌습니다.
참고로 파이어베이스는 NoSQL 기반입니다.<br>
관계형이 아니기 때문에 데이터를 적절히 구조화해 줄 필요가 있습니다.
![](/assets/posting/20190311/4.png){: width="100%" height="100%"}
<br>
<br>

#### 5. 데이터베이스에 들어갈 데이터를 작성합니다.
파이어베이스는 데이터를 JSON형태로 저장합니다.<br>
앱에서 사용할 데이터도 JSON형태로 작성합니다.
실서버 기준으로 “version”을 만들었고, 테스트 용도로 “versionTest”를 만들었습니다. 내부 데이터는 동일합니다.<br>

    {
      "version" : {
          "cancelButtonMessage" : "나중에",
          "compatibleVersionCode" : 9,
          "forceUpdateMessage" : "전자문서의 새 버전이 출시되었어요! 꼭 업데이트해 주세요!",
          "latestVersionCode" : 16,
          "latestVersionName" : "1.6.0",
          "updateButtonMessage" : "업데이트",
          "updateMessage" : "전자문서의 새 버전이 출시되었어요! 원활한 사용을 위해 업데이트해 주세요!"
          },
      "versionTest" : {
          "cancelButtonMessage" : "나중에",
          "compatibleVersionCode" : 0,
          "forceUpdateMessage" : "전자문서의 새 버전이 출시되었어요! 꼭 업데이트해 주세요!",
          "latestVersionCode" : 16,
          "latestVersionName" : "1.6.0",
          "updateButtonMessage" : "업데이트",
          "updateMessage" : "전자문서의 새 버전이 출시되었어요! 원활한 사용을 위해 업데이트해 주세요!"
          }
    }

이 데이터모델은 다른 제품에서도 이용할 수 있기 때문에 자세히 적어 봅니다.

|프로퍼티|설명|예시|
|--|--|--|
|latestVersionCode| 앱 최신 버전 코드 | 10 |
|latestVersionName| 앱 최신 버전 네임 | "v1.7.7" |
|updateMessage| 업데이트 팝업의 안내문구 |  |
|cancelButtonMessage| 업데이트 팝업의 취소버튼 | "나중에", "취소" |
|updateButtonMessage| 업데이트 팝업의 업데이트버튼 | "업데이트", "앱스토어" |
|compatibleVersionCode| 호환이 가능한 버전 정의, 앱에서는 자신보다 이 값이 높을 경우 강제 업데이트 시도 |9|
|forceUpdateMessage |강제 업데이트 팝업의 안내 문구 | “업데이트하지 않을 경우 앱을 종료합니다.”|

서비스를 운영하다보면 클라이언트를 강제적으로 업데이트해야 하는 상황이 생깁니다.
<br>최신 서버 API에 호환되지 않거나 오동작하는 앱의 버전일 경우
<br>강제 업데이트를 유도하도록 합니다. 
<br>
<br>
![](/assets/posting/20190311/6.png){: width="85%" height="100%"}
<br>
<br>


#### 6. 작성된 데이터를 JSON파일로 만들고 데이터베이스에 Import시킵니다.
![](/assets/posting/20190311/7.png){: width="100%" height="100%"}
<br>
<br>

#### 7. JSON으로 작성한 데이터가 데이터베이스에 잘 들어갔습니다 👍
![](/assets/posting/20190311/8.png){: width="100%" height="100%"}
<br>
<br>

#### 8. 데이터베이스의 구성이 완료되었습니다! 이제 애플리케이션을 개발할 차례입니다.
Firebase 콘솔에서 “google-service.json” 파일을 내려 받아 앱 프로젝트에 추가합니다.
![](/assets/posting/20190311/9.png){: width="100%" height="100%"}
<br>
<br>

#### 9. 안드로이드 프로젝트의 build.gradle에 dependices를 추가합니다.<br>
구글 파이어베이스-리얼타임데이터베이스 라이브러리를 이용한다고 보시면 됩니다.

      implementation  'com.google.firebase:firebase-core:16.0.4'  
      implementation  'com.google.firebase:firebase-database:16.0.4'

<br>

#### 10. 앱 프로젝트의 환경 구성은 끝났습니다.
이제 소스코드를 적절히 작성하면 됩니다.
파이어베이스에 [코딩 가이드](https://firebase.google.com/docs/database/android/start/){: target="blank"}가 자세히 나와 있으니 참고하여 개발하시면 됩니다.
제 기억에 십여분 만에 코딩 초안을 완성했던 것 같네요. 따봉쓰 👍👍👍
<br>
<br>

#### 11. Test
앱까지 개발이 완료되었으므로 이제 테스트해 볼 시간입니다.
<br>Firebase Console에서 Database의 값을 변경합니다.
<br>versionTest.latestVersionCode 값을 한 단계 높여 봅니다. 
![](/assets/posting/20190311/10.png){: width="100%" height="100%"}
<br>
<br>

#### 12. 켜 두었던 앱에서 업데이트 팝업이 노출되었습니다!!
![](/assets/posting/20190311/11.png){: width="100%" height="100%"}
신이가 납니다!!<br>
업데이트 버튼을 누르면 구글 플레이로 이동하도록 구현되어 있습니다.
구글 플레이에서 새 버전의 앱을 받으면 모든 시나리오가 완성됩니다!

끝났어요!! 개발 끝! 🙌
<br>
<br>


<br>
### 마치며
Firebase 실시간 데이터베이스를 이용하면서 여러가지 번잡스러운 상황을 피할 수 있어 좋았습니다.
보통 관리자 페이지를 만드려면
1. 도메인을 따고
2. 웹페이지를 만들고
3. 데이터베이스 컬럼을 추가하고
4. 여러 승인을 받아야 하고
5. 배포하고 관리하고...

등등...  참 귀찮은 일이 많은데 말이죠

가장 좋았던 것은 실시간 데이터베이스가 **오프라인 모드를 지원**한다는 점입니다.<br>
태블릿이 와이파이가 안되는 지역에 있다가<br>
와이파이 연결이 되면 Firebase가 알아서 데이터베이스 변화를 감지하고<br>
앱에 통보를 해 주는 것이 참 좋았습니다.

그리고...

Serverless Architecture가 유행했죠, 아직 하죠?<br>
Firebase를 잘 이용한다면 서버 없는 애플리케이션 서비스도 가능합니다.<br>
Storage, Hosting, Function만 잘 이용해도 만들 수 있습니다.<br>

다음에도 무언가를 들고 오겠습니다.<br>
읽어 주셔서 감사합니다!
<br>
<br>


### 추가, 로드 존슨님 트윗과 댓글ㅋ 😂😂😂😂
**[How can serverless have server errors?](https://twitter.com/springrod/status/1101705351001399296){: target="blank"}**
![](/assets/posting/20190311/servererrorofserverless.png){: width="80%" height="100%"}

