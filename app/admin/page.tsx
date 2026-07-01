"use client";
export const dynamic = "force-dynamic";

import { cn } from "@/lib/utils";
import { adminThemeCss } from "./components/adminThemeCss";
import { useAdminPage } from "./components/useAdminPage";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";
import AdminTabContent from "./components/AdminTabContent";
import AdminModals from "./components/AdminModals";

export default function AdminPage() {
  const state = useAdminPage();

  return (
    <div className={cn("adm-root h-screen overflow-hidden flex font-poppins", state.theme === "light" ? "adm-light" : "adm-dark")}>
      <style>{adminThemeCss}</style>

      <AdminSidebar
        tab={state.tab} navOpen={state.navOpen} setNavOpen={state.setNavOpen}
        unreadMsgs={state.unreadMsgs} unreadInbox={state.unreadInbox}
        unreadFeedback={state.unreadFeedback} unprayedSubmissions={state.unprayedSubmissions}
        unapprovedComments={state.unapprovedComments}
        onGo={state.go} onLogout={state.handleLogout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar
          searchQuery={state.searchQuery} setSearchQuery={state.setSearchQuery}
          searchOpen={state.searchOpen} setSearchOpen={state.setSearchOpen}
          notifOpen={state.notifOpen} setNotifOpen={state.setNotifOpen}
          notifications={state.notifications} unreadNotifCount={state.unreadNotifCount}
          markAllNotificationsRead={state.markAllNotificationsRead}
          theme={state.theme} setTheme={state.setTheme}
          adminEmail={state.adminEmail} onGo={state.go} onLogout={state.handleLogout}
        />

        <main className="adm-main flex-1 overflow-y-auto px-4 pb-8 md:px-12 md:pb-10">
          {state.loading ? (
            <div className="flex gap-2.5 justify-center py-[140px]">
              {[0, 200, 400].map((delay) => (
                <div key={delay} className="w-2 h-2 bg-[#d4a843] rounded-full animate-[adm-pulse_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
          ) : (
            <AdminTabContent
              tab={state.tab} db={state.db} load={state.load}
              ask={state.ask} modals={state.modals} setConfirm={state.setConfirm}
              onNav={state.go} mailSub={state.mailSub} setMailSub={state.setMailSub}
              posts={state.posts} blogSeries={state.blogSeries} blogTags={state.blogTags}
              subs={state.subs} msgs={state.msgs} logs={state.logs}
              inbox={state.inbox} templates={state.templates} campaigns={state.campaigns} analytics={state.analytics}
              testimonials={state.testimonials} libraryItems={state.libraryItems}
              upcomingEvents={state.upcomingEvents} feedbacks={state.feedbacks}
              blogComments={state.blogComments} trainings={state.trainings}
              galleryThemes={state.galleryThemes} eventRegistrations={state.eventRegistrations}
              prayerSubmissions={state.prayerSubmissions} discipleshipContent={state.discipleshipContent}
              disciples={state.disciples} faithTests={state.faithTests} users={state.users}
            />
          )}
        </main>
      </div>

      <AdminModals
        db={state.db} load={state.load}
        showPost={state.showPost} editPost={state.editPost} setShowPost={state.setShowPost}
        showSeries={state.showSeries} editSeries={state.editSeries} setShowSeries={state.setShowSeries}
        viewSeries={state.viewSeries} setViewSeries={state.setViewSeries} setEditPost={state.setEditPost}
        showTag={state.showTag} editTag={state.editTag} setShowTag={state.setShowTag}
        showReviews={state.showReviews} reviewPost={state.reviewPost} setShowReviews={state.setShowReviews}
        showTpl={state.showTpl} editTpl={state.editTpl} setShowTpl={state.setShowTpl}
        showCampaign={state.showCampaign} editCampaign={state.editCampaign} setShowCampaign={state.setShowCampaign}
        templates={state.templates} subs={state.subs}
        showTestimonial={state.showTestimonial} editTestimonial={state.editTestimonial} setShowTestimonial={state.setShowTestimonial}
        showLibItem={state.showLibItem} editLibItem={state.editLibItem} setShowLibItem={state.setShowLibItem}
        showUpcoming={state.showUpcoming} editUpcoming={state.editUpcoming} setShowUpcoming={state.setShowUpcoming}
        showTraining={state.showTraining} editTraining={state.editTraining} setShowTraining={state.setShowTraining}
        showGallery={state.showGallery} editGallery={state.editGallery} setShowGallery={state.setShowGallery}
        showFaithTest={state.showFaithTest} editFaithTest={state.editFaithTest} setShowFaithTest={state.setShowFaithTest}
        showDisciple={state.showDisciple} editDisciple={state.editDisciple} setShowDisciple={state.setShowDisciple}
        viewProgressDisciple={state.viewProgressDisciple} setViewProgressDisciple={state.setViewProgressDisciple}
        confirm={state.confirm} setConfirm={state.setConfirm}
      />
    </div>
  );
}
