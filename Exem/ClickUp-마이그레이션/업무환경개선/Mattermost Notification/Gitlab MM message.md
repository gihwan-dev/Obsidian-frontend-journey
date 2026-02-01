# 😱 Gitlab > MM message

## 도입 배경
- gitlab 의 integrations 에 Mattermost 를 연동 할 수 있지만, 이벤트 목록에서 선택한 이벤트가 발생하면 고정된 탬플릿의 메시지를 고정된 Mattermost 방에 보낼 수 있는 기능 밖에 없음.
- 많은 프로젝트에 관여하다보니 어떤 메시지가 내가 봐야하는 알림인지 구별이 잘 되지않음.
- 많은 메시지를 보내지 않게 하기위해 Merge Request 이벤트만 사용중인데, Comment 의 알림이 더 필요하다 생각하지만 알림을 위한 Mattermost 방에 있는 모두가 Comment 알림을 볼 필요는 없음.
- 메시지 종류 별로 개인 메시지로 보내 줄 필요가 있으며, 필요없는 정보 및 추가 정보들을 커스텀 할 수 있는 방법을 생각하다 보니 Mattermost 의 webhook 으로 메시지를 포멧팅해서 보내주는 서버를 중간에 두면 되겠다고 생각함.

## 작업 내용
- Gitlab 이슈와 MR 에 comment 작성시 MM 개인 메시지 발송되는 [node server 프로젝트 생성](http://gitlab.exem.xyz/dpm-fe/mattermost-message-server)

(개인 메시지이므로 작업표시줄과 MM 에 badge 가 발생되어 알림 효과가 큼)

![](https://t25540965.p.clickup-attachments.com/t25540965/6ee88189-e86e-49f7-a7bf-137f391abc2e/image.png)

- MR create, close, merge 동작 발생시 assignee 에게 badge 발생하도록 메시지 형태 변경

![](https://t25540965.p.clickup-attachments.com/t25540965/bf21fbcd-7460-412c-97ea-b16f5fa5a23a/image.png)

- ~~메시지 포멧팅 및 발송 규칙 변경시 적용이 용이하도록~~ ~~`gitlab CI/CD`~~ ~~이용하여 공용 window 환경(10.10.35.61)에 구동중인 서버에 패치 되도록 함~~
  > 리눅스 환경에서 도커 이미지로 build, deploy 되도록 변경 완료

- node 서버 이미지 빌드, 배포를 위한 `Dockerfile` , `.gitlab-ci.yml` 작성
  이벤트나 메시지를 변경하고 싶으면 수정해서 master 에 push 하면 서버에 자동 적용됨.

- [이모지 이벤트 추가](http://gitlab.exem.xyz/dpm-fe/mattermost-message-server/-/commit/eda908e22ae3906608cf07a4d9a7869fe47cf46f)하여서 따봉 눌러 주는 것도 메시지로 확인 가능

![](https://t25540965.p.clickup-attachments.com/t25540965/f66b747a-33d5-40c0-95ed-614797b096e1/image.png)

- 코멘트에 mention 으로 유저를 언급할 경우 해당 유저에게도 메시지가 가도록 [기능 추가](http://gitlab.exem.xyz/dpm-fe/mattermost-message-server/-/commit/6d25d8a2b25e0ed29e4a64b9c151754a8b401825)

![](https://t25540965.p.clickup-attachments.com/t25540965/1b171a46-2ac0-4fef-8798-3c7190fd9e80/image.png)

- MR 생성 직후에 메시지가 보내지기 때문에 확인할 내용을 작성하기 전에 메시지를 받아 보는 경우가 있음.
  따라서 `draft` 가 걸려있는 경우에는 해당 MR 의 알림 메시지를 보내지 않고, MR 이 update 되는 순간에 메시지를 보내도록 한다. (단, `draft` 가 지워진 최초 1회만 보내도록 함)

## 구현 방법
- gitlab 에서 이벤트 발생시 [webhook](https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#comment-events) 을 trigger 할 수 있고, MM 에서는 webhook 을 받아 메시지로 표현이 가능함. 하지만 gitlab 의 integrations 기능에는 지정된 포멧으로만 MM 에 webhook 을 보낼수 있음
- 원하는 형태의 MM 메시지를 받아보기 위해 gitlab webhook 을 받으면 [MM webhook 으로 포멧팅](https://developers.mattermost.com/integrate/webhooks/incoming/) 해서 보내주는 서버를 구축하고 공용 환경에 실행시켜둠.
- gitlab ci/cd 를 이용해서 10.10.35.62 에 서버를 실행하고, 패치하므로 [프로젝트](http://gitlab.exem.xyz/dpm-fe/mattermost-message-server)를 생성해서 10.10.35.62 환경에 docker 및 gitlab runner 를 설정해둠

- 깃랩 유저 목록을 받아오기 위해 [개인 계정에서 access token 을 발급](http://gitlab.exem.xyz/-/profile/personal_access_tokens)받아 user api 조회시 사용함

## 추가로 필요한 사항
1. ~~gitlab 은 REST API가 존재해서 유저 정보를 받아올수 있지만, MM 유저 리스트를 받아오는 방법이 없어서 메시지를 받고싶은 유저는 json 파일에 직접 id 를 등록해야함~~ > Notification 방에 존재하는 사람의 목록을 받아오는 API 가 있어서 서버 구동시 해당 API 를 이용해서 MM 유저 정보를 자동으로 받아 오도록 구현 완료

2. gitlab 프로젝트에서 webhook 을 trigger 해야 메시지를 받아 볼 수 있으므로, 메시지를 받아보기 원하는 프로젝트들은 webhook 설정을 해야함

![](https://t25540965.p.clickup-attachments.com/t25540965/caa09f09-f6d7-4028-81ae-6d68da3eaa8d/image.png)

3. 개인적인 의견으로 메시지 발송 규칙과 포멧을 정하였으므로 사용하면서 필요한 부분과 불필요 한 부분의 규칙 재정립이 필요함

## 추가 이슈
1. ~~이미지 링크에 https 를 사용하지 않으면 mm 에서 표시되지 않음.~~ 해결됨
2. ~~리눅스 환경으로 전환이 필요함~~ > 전환 완료
3. ~~개인 메시지를 웹훅으로 보내면, 웹훅을 생성한 사람과 메시지를 받는사람 간의 대화 창을 통해 메시지가 표현된다~~ > 공용 계정 생성해서 웹훅 변경 완료
4. ~~alpine chrome 베이스 이미지가 있어서 대체하여 1Gb 근처로 줄임~~

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1471720*
