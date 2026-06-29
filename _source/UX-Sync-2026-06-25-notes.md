# 📝 Notes

Jun 25, 2026

## UX Sync up

Invited [Aravind Jegajeeva Rajasekar](mailto:aravind@trmeric.com) [Siddharth Bohra](mailto:siddharth@trmeric.com) [Roshan PR](mailto:roshan@trmeric.com)

Attachments [UX Sync up](https://calendar.google.com/calendar/event?eid=NzRkcTE2cGQ4Nmp1ajJxZTFqMTBhdThucHNfMjAyNjA2MjVUMTcwMDAwWiByb3NoYW5AdHJtZXJpYy5jb20)

Meeting records [Transcript](https://docs.google.com/document/d/1vbBddBbJLGbHBrmjggc3kxMQivWSfVAQK11mwSj3K6o/edit?usp=drive_web&tab=t.9u7ei66dqsnj) 

### Summary

Meeting focused on design alignment, technical development strategy, and consolidating UI elements for improved executive dashboard coherence.

**Interface and Development Alignment**  
Discussions centered on unifying widget interactions and adopting an Integrated Development Environment strategy to streamline front end code integration. The team prioritized finishing current design stages before initiating new functional components.

**Dashboard and UI Refinement**  
Participants critiqued visual inconsistencies and clutter, leading to the removal of unnecessary elements from the demand canvas. A dual mode approach was proposed to separate dashboard viewing from active task management.

**Analytics and Feature Strategy**  
The team decided to integrate specific work progression metrics into the executive summary. Engineering efforts were directed to stop unapproved feature additions and focus solely on finalizing the hub landing page.

### Decisions

## Aligned

* **Unified work and action view** The demand grid is set to adopt a unified view that integrates work details and actionable tasks together to ensure clear correlation.

* **Standardized diagram sizing** All diagrams across the interface must maintain a consistent, standard size rather than being adjusted individually.

* **Interface visual cleanup** The interface will be decluttered by removing the yellow line above the demand section and eliminating extraneous "new demand" UI elements to streamline the user flow.

* **Dashboard and action mode separation** The interface will be structured to allow users to toggle between a "dashboard mode" and an "action mode."

* **Essential UI content requirements** The interface must include visual indicators demonstrating how individual work tasks contribute to corporate business objectives.

We've **updated the Decisions section** using your feedback.

Let us know what you think: [Helpful](https://google.qualtrics.com/jfe/form/SV_5p6FWBVWvynleNU?isGoogler=no&isHelpful=yes) or [Not Helpful](https://google.qualtrics.com/jfe/form/SV_5p6FWBVWvynleNU?isGoogler=no&isHelpful=no)

### Next steps

- [ ] \[Aravind Jegajeeva Rajasekar\] Build Widget Interaction: Develop the widget interaction functionality where a widget appears upon hovering or clicking, as discussed.

- [ ] \[Aravind Jegajeeva Rajasekar\] Remove Bug: Remove the unwanted element from the page identified as a bug.

- [ ] \[Aravind Jegajeeva Rajasekar\] Remove Yellow Line: Remove the yellow line above the demands section to reduce visual distraction.

- [ ] \[Aravind Jegajeeva Rajasekar\] Delete Demand: Delete the new demand entry that was incorrectly added and is not supposed to be there.

- [ ] \[Aravind Jegajeeva Rajasekar\] Update Analytics: Incorporate the nature of work analytics and the contribution-to-corporate-business view into the executive summary.

- [ ] \[Aravind Jegajeeva Rajasekar\] Finalize Pages: Finalize the design of the hub landing page and the subsequent navigation pages to ensure they are consistent with existing requirements.

### Details

* **UI and Interaction Design for the User Journey**: Siddharth Bohra and Aravind Jegajeeva Rajasekar reviewed the initial user journey interface, specifically discussing the functionality of the "blind screen," the tour, and the method for interacting with widgets (via clicking or hovering). Aravind Jegajeeva Rajasekar confirmed they are currently building these interactions and intends to embed them soon. Siddharth Bohra emphasized the importance of a thoughtful, step-by-step design process, advising against rushing to later stages of the design before the first two steps are finalized ([00:00:24](#00:00:24)).

* **Development Environment and Bug Fixes**: Aravind Jegajeeva Rajasekar identified a bug involving a "tango" element on the previous page and agreed to remove it ([00:01:33](#00:01:33)). Aravind Jegajeeva Rajasekar also described a shift in development strategy, moving from cloud-based building to utilizing an IDE (VS Code) to code the project, which includes embedding the canvas, persona, and user journey data to streamline front-end integration ([00:02:21](#00:02:21)).

* **Technical Implementation Strategy**: Aravind Jegajeeva Rajasekar is currently converting designs into HTML and aligning the code with the existing React-based product structure to ensure it is readable and manageable for the development team. Siddharth Bohra reiterated the necessity of finalizing the current page's design before moving forward, ensuring the progress remains consistent with the project's actual development status ([00:03:14](#00:03:14)).

* **Demand Grid and Action View Integration**: Siddharth Bohra questioned the inclusion of "my actions" on the demand grid page, noting that currently clicking elements leads to a different page rather than displaying a snapshot. The two discussed creating a unified view where work, insights, and actions are correlated in one place, rather than separated ([00:04:02](#00:04:02)). Aravind Jegajeeva Rajasekar agreed to adjust the current implementation to better align with the goal of maintaining a cohesive executive summary ([00:05:09](#00:05:09)).

* **Design Consistency and Visual Layout**: Siddharth Bohra critiqued the visual inconsistency of diagram sizes and the lack of visual "pop" in the executive summary, suggesting they explore ways to improve the layout. Aravind Jegajeeva Rajasekar proposed adding two more lines of "tango insights" to the view ([00:05:09](#00:05:09)). Siddharth Bohra also requested the removal of a yellow line above the demands section, noting it functioned as a distraction ([00:06:00](#00:06:00)).

* **Demand Canvas Cleanup**: Siddharth Bohra instructed Aravind Jegajeeva Rajasekar to remove unnecessary elements, specifically an erroneously included "new demand" placeholder ([00:07:01](#00:07:01)). Siddharth Bohra emphasized that the interface must reflect the actual column management reality of the current demand canvas to avoid providing inaccurate specifications to the engineering team ([00:07:57](#00:07:57)).

* **Demand Card Structure and Font Styling**: Aravind Jegajeeva Rajasekar outlined the structure of the demand cards, which includes the title, milestone, action, and "tango" inputs. Siddharth Bohra expressed concern regarding the font size and color of certain text, noting it appeared too light. Aravind Jegajeeva Rajasekar explained that the design uses grey or muted tones for items not requiring immediate attention to distinguish them from more critical, darker-toned elements ([00:08:44](#00:08:44)).

* **Dashboard and Action Mode**: Siddharth Bohra suggested adopting a dual-mode approach where users can switch between a "dashboard mode" for viewing information and an "action mode" for performing tasks directly from the interface, similar to a previous roadmap manager design ([00:09:45](#00:09:45)).

* **Project Finalization and Analytics Integration**: Siddharth Bohra pointed out that the current executive summary lacks specific analytics, including data on the nature of work and the time required to move missions between stages, and directed Aravind Jegajeeva Rajasekar to incorporate these metrics ([00:11:00](#00:11:00)). The meeting concluded with Siddharth Bohra instructing Aravind Jegajeeva Rajasekar to stop adding unapproved features, focus on finalizing the key pages—including the hub landing page—and ensure the design effectively incorporates all previously discussed elements without cluttering the interface ([00:11:50](#00:11:50)).

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*How is the quality of **these specific notes?** [Take a short survey](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=eBCmt0siQ0E_f9B2fFA7DxIYOAIIigIgABgECA&detailid=standard&screenshot=false) to let us know your feedback, including how helpful the notes were for your needs.*

# 📖 Transcript

Jun 25, 2026

## UX Sync up \- Transcript

### 00:00:24 {#00:00:24}

**Siddharth Bohra:** Hey man.

**Aravind Jegajeeva Rajasekar:** I was just synthesizing the notes that we have.

**Siddharth Bohra:** Yeah, let's just make sure we get the first part of the journey right I know there's a there are different elements to it but we need to I don't know if that that UI that you have in the beginning is is useful enough for I the the tour is but

**Aravind Jegajeeva Rajasekar:** Yeah.

**Siddharth Bohra:** uh is this all that we need here right I mean is this blind screen okay and the tour and or there is those widgets should be there by by by let's say touching a clicking or hovering over this a widget appears at the bottom or I I don't know what's that answer uh

**Aravind Jegajeeva Rajasekar:** I will make that interaction.

**Siddharth Bohra:** I'm

**Aravind Jegajeeva Rajasekar:** Uh I'm building that interaction. I am yet to embed in it. I'll make sure it happens.

**Siddharth Bohra:** Yeah.

**Aravind Jegajeeva Rajasekar:** We'll have the We'll see that.

**Siddharth Bohra:** So go step by step. Don't go further ahead. I want every step, every screen to feel uh well thoughtful.

### 00:01:33 {#00:01:33}

**Siddharth Bohra:** Uh it's I don't want us to rush into the six step when we didn't get the first steps, two steps right.

**Aravind Jegajeeva Rajasekar:** I understand something. So I have a method.

**Siddharth Bohra:** So I'm

**Aravind Jegajeeva Rajasekar:** Uh so right now I've done what you have written in the transcript in the user flow now. So now I wanted to write my input. So this is how we are going to go with the demand flow. So this is how we design uh in a separate tab. So maybe that will be really helpful for us to uh have a middle ground. Uh widgets. Yeah, I'll definitely look into it and then add it to it.

**Siddharth Bohra:** And I don't know if you need uh this guy on the on this on the previous page.

**Aravind Jegajeeva Rajasekar:** What's up?

**Siddharth Bohra:** This uh you already have

**Aravind Jegajeeva Rajasekar:** Okay. Uh I know uh it's a bug.

**Siddharth Bohra:** tango.

**Aravind Jegajeeva Rajasekar:** I'll I'll get rid of it.

### 00:02:21 {#00:02:21}

**Aravind Jegajeeva Rajasekar:** I put it across everywhere. I started building an ID. I'm not building in cloud anymore. I started coding these things. So right now I will have the code stack so that the front end will be absolutely streamlined and

**Siddharth Bohra:** Okay.

**Aravind Jegajeeva Rajasekar:** then we'll just fly through the like in like you know integrating it so we don't have to wait.

**Siddharth Bohra:** Okay.

**Aravind Jegajeeva Rajasekar:** I will make sure yeah I'll I'll make sure every single uh components and everything is on

**Siddharth Bohra:** as in but this is our

**Aravind Jegajeeva Rajasekar:** point.

**Siddharth Bohra:** ID or which ID are you using but

**Aravind Jegajeeva Rajasekar:** Uh uh right now let me show you what I'm doing. Uh yeah,

**Siddharth Bohra:** we have our own IDE now don't we

**Aravind Jegajeeva Rajasekar:** we have our own ID. Uh I'm talking about this VS code. So yeah, like I have our canvas journey, persona journey and our user journey. Everything is embedded here. So this VS code have every single data.

### 00:03:14 {#00:03:14}

**Aravind Jegajeeva Rajasekar:** So right now it's all in HTML. And right now our product is in React or what language is it? I don't know. So I asked Ashish. So if I make these things and uh what the code that we have and convert all these things to it, I can read the code. So it's easy for me to handle this. So it'll be easy for the team to just streamline it. So the weak thing that you were telling, it's already in motion. So we can do that. So that's what I'm doing right now. And um yeah,

**Siddharth Bohra:** I want to get this page right. Uh Arvin, I want to get this right and go to the next page

**Aravind Jegajeeva Rajasekar:** I will make sure each and Okay. Okay.

**Siddharth Bohra:** now.

**Aravind Jegajeeva Rajasekar:** Let me see. Okay, I'll have to keep on load maps. you have paper ticket.

**Siddharth Bohra:** Why have you added my actions on this page?

### 00:04:02 {#00:04:02}

**Siddharth Bohra:** Are we going to Why is it

**Aravind Jegajeeva Rajasekar:** Uh okay. So I had this view ideally what is

**Siddharth Bohra:** there?

**Aravind Jegajeeva Rajasekar:** is in the demand grid there are certain actions that the demand owner would want to do and uh I think it was mentioned somewhere like the actions that I can do that I create

**Siddharth Bohra:** It was mentioned

**Aravind Jegajeeva Rajasekar:** I yeah and I wanted to like I don't wanted to go inside the actions and everything so maybe right here we can have this view and

**Siddharth Bohra:** Oh, so what I was saying is if you go back to the other

**Aravind Jegajeeva Rajasekar:** uh Mhm.

**Siddharth Bohra:** view, if I click on any of this like we have up level there, right? If I click it takes me to a to that page of live.

**Aravind Jegajeeva Rajasekar:** Right.

**Siddharth Bohra:** I was more thinking that a snapshot would appear here which says this is what it is.

**Aravind Jegajeeva Rajasekar:** Mhm.

**Siddharth Bohra:** is this is where it's kind of uh this is where a quick summary of the demand on the left and a set of actions or something like that is what I was thinking when I said actions now you can always embed action we we're trying to create a unified view of work right where what is the work and what is

### 00:05:09 {#00:05:09}

**Aravind Jegajeeva Rajasekar:** Wow.

**Siddharth Bohra:** the action to be taken what is the work what is the insight what is the action to be taken comes on that small

**Aravind Jegajeeva Rajasekar:** Huh?

**Siddharth Bohra:** little thing uh I was more thinking because otherwise now I can't correlate this to this right the action is another place this is in this place so it's not a kind of

**Aravind Jegajeeva Rajasekar:** Okay, then I will mute this. Then I will mute this.

**Siddharth Bohra:** clear

**Aravind Jegajeeva Rajasekar:** I will somehow coer the idea. Yours were actually fine. Uh like having an uplevel kind of an option and

**Siddharth Bohra:** but before you go there before we go do that uh we need to clean up this

**Aravind Jegajeeva Rajasekar:** then

**Siddharth Bohra:** space well so is this is the this is the top view fixed kind of I think it's too Right.

**Aravind Jegajeeva Rajasekar:** Okay.

**Siddharth Bohra:** You need some color

**Aravind Jegajeeva Rajasekar:** Um okay.

**Siddharth Bohra:** some.

**Aravind Jegajeeva Rajasekar:** Um I'm imagining there will be two more lines of tango insights and uh maybe

**Siddharth Bohra:** Yeah.

### 00:06:00 {#00:06:00}

**Siddharth Bohra:** But still if one of these could be again the size of the diagrams is

**Aravind Jegajeeva Rajasekar:** more.

**Siddharth Bohra:** different. We can't have that. One diagram is bigger, another one is smaller. Uh which is not good.

**Aravind Jegajeeva Rajasekar:** Okay.

**Siddharth Bohra:** We should have the standard size of diagrams. Don't tweak them around for things.

**Aravind Jegajeeva Rajasekar:** Okay.

**Siddharth Bohra:** slideshow can show a bigger view but one of those things either the right hand side tango could have a I don't know how how do we make this ask get some ideas from claude or other things but make this bring a little more pop to that executive summary I it's just it's just lot

**Aravind Jegajeeva Rajasekar:** Okay. Okay.

**Siddharth Bohra:** of white and do we need that line on top of demands that yellow line above demands

**Aravind Jegajeeva Rajasekar:** Oh, this uh it's our No,

**Siddharth Bohra:** Yes.

**Aravind Jegajeeva Rajasekar:** we don't ideally like we don't have to. It's like a nice it's breaking the monotonous. I felt without it.

### 00:07:01 {#00:07:01}

**Aravind Jegajeeva Rajasekar:** It felt like a complete flow through. Uh I don't know. Let me see if it What do you think

**Siddharth Bohra:** Yeah, I think it's better without it.

**Aravind Jegajeeva Rajasekar:** that's okay?

**Siddharth Bohra:** It just adds a distraction to the And then you added this new demand

**Aravind Jegajeeva Rajasekar:** Okay.

**Siddharth Bohra:** there. Why would you add that?

**Aravind Jegajeeva Rajasekar:** Uh, this was old one. I will remove it. This was supposed to go away. This wasn't supposed to be here.

**Siddharth Bohra:** We have to finalize this stuff right? So we are I mean we can't keep iterating and placing things that are not going to be there. Uh let's go screen by screen. Let's get this down. Let's give it to the engineering team so that they can do it. This should be the final screen. I don't know how similar or different it is. the columns in the demand canvas uh right now are very different from what you have done.

### 00:07:57 {#00:07:57}

**Siddharth Bohra:** Uh the the column management part is not there. So if if you give them stuff that is not rooted in where we are then it's a problem.

**Aravind Jegajeeva Rajasekar:** Take okay

**Siddharth Bohra:** I need this to be connected to reality right in in in a way that we don't have to think

**Aravind Jegajeeva Rajasekar:** minutes.

**Siddharth Bohra:** about what did Arvin miss or what did he include which is

**Aravind Jegajeeva Rajasekar:** I agree Sad.

**Siddharth Bohra:** not what is this other view you have a line view

**Aravind Jegajeeva Rajasekar:** It will it will be it will be that is the card we was explaining the other

**Siddharth Bohra:** and we have another view next to new demand what is that view

**Aravind Jegajeeva Rajasekar:** day uh like what if uh what if there are like very few demands and what kind of view we would want to show we were experimenting so we don't want to sorry

**Siddharth Bohra:** show Let's scroll down.

**Aravind Jegajeeva Rajasekar:** s

**Siddharth Bohra:** Let's scroll down. Let me see

**Aravind Jegajeeva Rajasekar:** yeah so the structure of this is we have the title

### 00:08:44 {#00:08:44}

**Siddharth Bohra:** it.

**Aravind Jegajeeva Rajasekar:** of the demand and then the milestone that they have to achieve and uh this particular section is the action section. If there is any action that is required that will be in the third line and if tango has any inputs that will be the fourth line. So this is the structure that we will embed and more the user use it they will I just it will become like a habit to them. I just want to look at the third line and every single cards and then they will scan through those things and they will look at it. So that's the approach that I'm going for.

**Siddharth Bohra:** What is the font size and what is the font color? I think some of it is very light.

**Aravind Jegajeeva Rajasekar:** uh the ones that does not require attention uh like uh likewise like on track nothing needs you right now it's slightly mute like it's slightly less gray and tango is monitoring this demand and surface that is needs it's trying to put some statements that is slightly darker and the chips is contrasted towards the hub

### 00:09:45 {#00:09:45}

**Siddharth Bohra:** So if if you look at the the page I I did for road map manager just uh look at that one pager that I the journey

**Aravind Jegajeeva Rajasekar:** Okay. Um Okay.

**Siddharth Bohra:** Wasn't there a diagram? Yeah. Why can't we have something like this that brings together the insight, the actions, something like that?

**Aravind Jegajeeva Rajasekar:** Yeah, we can do this like the actions will be customized to what the action that they need to take the CDs will be customized to that and I see the date is hard capacity to new engineers to assemble this is about resource uh trucks okay this is lacking so it's basically keywords of the recommendations.

**Siddharth Bohra:** No, no, you don't need to take like don't need to take it like to like I'm simply saying can

**Aravind Jegajeeva Rajasekar:** No, I'm trying to understand

**Siddharth Bohra:** we build again in stage if

**Aravind Jegajeeva Rajasekar:** we can we

**Siddharth Bohra:** you allows them to work from there itself.

**Aravind Jegajeeva Rajasekar:** can

**Siddharth Bohra:** So you are either in dashboard mode or you're in action mode.

### 00:11:00 {#00:11:00}

**Siddharth Bohra:** So it's like you can do things from right there.

**Aravind Jegajeeva Rajasekar:** it can be

**Siddharth Bohra:** Okay,

**Aravind Jegajeeva Rajasekar:** nice.

**Siddharth Bohra:** go back. Let's not worry about this right now. Just go back. Just make this screen final.

**Aravind Jegajeeva Rajasekar:** Yeah.

**Siddharth Bohra:** So you have the life cycle on the left. You have portfolios. This is as per what we discussed,

**Aravind Jegajeeva Rajasekar:** Mhm.

**Siddharth Bohra:** right? Have you finalized the the top executive summary options?

**Aravind Jegajeeva Rajasekar:** Yeah.

**Siddharth Bohra:** All the things that we put there, I put there.

**Aravind Jegajeeva Rajasekar:** Yeah. Mostly I think so. Yeah, we did. We did.

**Siddharth Bohra:** Did we

**Aravind Jegajeeva Rajasekar:** Uh, honestly,

**Siddharth Bohra:** No, you didn't.

**Aravind Jegajeeva Rajasekar:** I didn't

**Siddharth Bohra:** The analytics are interesting. Look at that tab that I can see the nature of work. You have it. How much time does it take to move missions from this to this? You don't have that.

### 00:11:50 {#00:11:50}

**Aravind Jegajeeva Rajasekar:** No,

**Siddharth Bohra:** Where is that UI?

**Aravind Jegajeeva Rajasekar:** no, I don't have that. Uh, okay. Take.

**Siddharth Bohra:** I also get to see how my work contributes to corporate business. Please stick to this. You can have more but not

**Aravind Jegajeeva Rajasekar:** Okay. Okay.

**Siddharth Bohra:** less.

**Aravind Jegajeeva Rajasekar:** Okay. I'll get these things in motion mode.

**Siddharth Bohra:** Yeah.

**Aravind Jegajeeva Rajasekar:** Action

**Siddharth Bohra:** So let's finalize these pages. Arvin this this and the project.

**Aravind Jegajeeva Rajasekar:** mode.

**Siddharth Bohra:** Let's let's get this flow down to the tea and don't embed new things that are not

**Aravind Jegajeeva Rajasekar:** Got it. Okay. No,

**Siddharth Bohra:** uh we trying to make it easy not we're not not trying to make it complex if

**Aravind Jegajeeva Rajasekar:** I'll stick to the I'll stick to the list. Yeah. Yeah.

**Siddharth Bohra:** I add something here you can add it right we want a bunch of different options there we'll add those as part of that executive summary and all that and the bottom portion please look at what we have right

**Aravind Jegajeeva Rajasekar:** Mhm.

**Siddharth Bohra:** now make sure it is effectively Incorporating that doesn't mean we have to crowd the place exactly like that but it has to be our user shouldn't say where did this go where did that go we don't want to keep answering these

**Aravind Jegajeeva Rajasekar:** Got it.

**Siddharth Bohra:** questions so

**Aravind Jegajeeva Rajasekar:** Focus.

**Siddharth Bohra:** the hub landing page very very important this page navigating to the next

**Aravind Jegajeeva Rajasekar:** Got

**Siddharth Bohra:** page all of these uh let's get these three four pages right absolutely right okay I got I have a call in a few minutes.

**Aravind Jegajeeva Rajasekar:** it. Okay. Okay.

**Siddharth Bohra:** Yeah.

**Aravind Jegajeeva Rajasekar:** Good luck. Yeah. Bye.

### Transcription ended after 00:13:29

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*