package main

import (
	"log"
	"os"
	"net/http"
	"slbbl/internal/config"
	"slbbl/internal/database"
	"slbbl/internal/handlers"
	"slbbl/internal/middleware"
	"slbbl/internal/models"
	"slbbl/internal/seed"
	"time"
"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"path/filepath"
    "runtime"
)

func main() {
_, b, _, _ := runtime.Caller(0)
    basepath := filepath.Dir(b)
    envPath := filepath.Join(basepath, "../.env")

    // Load .env file
    if err := godotenv.Load(envPath); err != nil {
        log.Println("⚠️ Could not load .env file:", err)
    }
	// Load config
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("❌ Failed to load config:", err)
	}

	// Connect to database
	db, err := database.NewDatabase(cfg.GetDSN())
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Seed default admin user
	seed.SeedAdminUser(db)

	// Set Gin release mode if production
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	router := gin.Default()

	// CORS middleware config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, 
	
		// AllowOrigins:     []string{"https://slbbl-banepa.onrender.com"},
		// AllowOrigins:     []string{"https://slbbl-frontend.onrender.com"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve uploaded files - you must have these folders existing with proper permissions
	router.Static("/uploads", "./server/cmd/uploads")
	uploadFinancialReportsPath := "./uploads/financial_reports"
	uploadAnnualReportsPath := "./uploads/annual_reports"
	uploadPrincipalIndicatorsPath := "./uploads/principal_indicators"
	uploadSebonDisclosurePath := "./uploads/sebon_disclosures"
	uploadStaffPath := "./uploads/staff_training_reports"
	uploadNoticePath:="./uploads/notices"
	uploadDownloadsPath := "./uploads/downloads"
    uploadSpokesPath := "./uploads/spokespersons"
    uploadProductPath:="./uploads/products"
   uploadServicePath:="./uploads/services"
   uploadSuccessStoriesPath:="./uploads/successstories"
   uploadPopupNoticePath := "./uploads/popup_notices"
   uploadBodPath:="./uploads/bods"


	

	// JWT secret for auth handlers
	jwtSecret := []byte(cfg.JWT.Secret)

	// Initialize handlers, passing DB and upload paths where needed
	authHandler := handlers.NewAuthHandler(db, jwtSecret)
	bodHandler := handlers.NewBodHandler(db,uploadBodPath)
	managementHandler := handlers.NewManagementHandler(db)
	branchHandler := handlers.NewBranchHandler(db)
	serviceHandler := handlers.NewServiceHandler(db,uploadServicePath)
	aboutHandler := handlers.NewAboutHandler(db)
	productHandler := handlers.NewProductHandler(db,uploadProductPath)
	baseRateHandler := handlers.NewBaseRateHandler(db)
	savingInterestRateHandler := handlers.NewSavingInterestHandler(db)
	loanInterestHandler := handlers.NewLoanInterestHandler(db)
	financialReportHandler := handlers.NewFinancialReportHandler(db, uploadFinancialReportsPath)
	annualReportHandler := handlers.NewAnnualReportHandler(db, uploadAnnualReportsPath)
	principalIndicatorHandler := handlers.NewPrincipalIndicatorHandler(db, uploadPrincipalIndicatorsPath)
	sebonHandler := handlers.NewSebonDisclosureHandler(db, uploadSebonDisclosurePath)
	staffHandler:=handlers.NewStaffTrainingHandler(db,uploadStaffPath)
	noticeHandler := handlers.NewNoticeHandler(db, uploadNoticePath)
	  galleryHandler := handlers.NewGalleryHandler(db)
	  successstoriesHandler:=handlers.NewSuccessStoryHandler(db,uploadSuccessStoriesPath)
	  downloadHandler := handlers.NewDownloadHandler(db, uploadDownloadsPath)
spokespersonHandler := handlers.NewSpokespersonHandler(db, uploadSpokesPath)
popupNoticeHandler := handlers.NewPopupNoticeHandler(db, uploadPopupNoticePath)
scrollingNoticeHandler := handlers.NewScrollingNoticeHandler(db)
headOfficeStaffHandler := handlers.NewHeadOfficeStaffHandler(db)
vacancyHandler := handlers.NewVacancyHandler(db)





	// Public routes group
	public := router.Group("/api/v1")
	{
		public.POST("/register", authHandler.Register)
		public.POST("/login", middleware.RateLimiter(), authHandler.Login)

		public.GET("/bods", bodHandler.GetPublicBods)
		public.GET("/management-team", managementHandler.GetPublicManagement)
		public.GET("/branches", branchHandler.GetAllBranches)
		public.GET("/branches/:province", branchHandler.GetBranchesByProvince)
		public.GET("/services", serviceHandler.GetAllServicesPublic)
		public.GET("/products", productHandler.GetAllProductsPublic)
		public.GET("/base-rates", baseRateHandler.GetAllBaseRatesPublic)
		public.GET("/saving-interest-rates", savingInterestRateHandler.GetAllPublicSavingRates)
		public.GET("/loan-interest-rates", loanInterestHandler.GetAllLoanInterestRatesPublic)
		public.GET("/financial-reports", financialReportHandler.GetAllPublicFinancialReports)
		public.GET("/annual-reports", annualReportHandler.GetPublicAnnualReports)
		public.GET("/principal-indicators", principalIndicatorHandler.GetPublicPrincipalIndicators)
		public.GET("/sebon-disclosures", sebonHandler.GetAllPublicDisclosures)
public.GET("/staff-training-reports", staffHandler.GetAllPublicStaffTrainingReports)
public.GET("/notices", noticeHandler.GetAllPublicNotices)
 public.GET("/galleries", galleryHandler.GetAllPublicGalleries)
  public.GET("/success-stories", successstoriesHandler.GetAllSuccessStoriesPublic)
  public.GET("/footer-downloads", downloadHandler.GetAllDownloads)
public.GET("/footer-spokespersons", spokespersonHandler.GetAllSpokePerson)
public.GET("/popup-notices", popupNoticeHandler.GetAllPopupNotices)
// In your routes setup
public.GET("/popup-notice/latest", popupNoticeHandler.GetLatestPopupNotice)
public.GET("/scrolling-notices", scrollingNoticeHandler.GetScrollingNotices)
public.GET("/scrolling-notices/:id", scrollingNoticeHandler.GetScrollingNoticeByID)
 public.GET("/head-office-staff", headOfficeStaffHandler.GetAllStaff)
 public.GET("/vacancies", vacancyHandler.GetVacancies)








		public.GET("/about/messages", aboutHandler.GetMessages)
		//public.GET("/about/vision", aboutHandler.GetAboutVision)
		public.GET("/about/stats", aboutHandler.GetStats)
		public.GET("/about/ceo", aboutHandler.GetCEOInfo)
        public.GET("/about/slides", aboutHandler.AdminGetSlides)

	}

	// Protected routes group (requires authentication)
	protected := router.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware(jwtSecret))
	{
		protected.GET("/me", getProfile)
	}

	// Admin routes group (requires admin role)
	admin := protected.Group("/admin")
	admin.Use(middleware.RequireRole(string(models.RoleAdmin)))
	{
		admin.PATCH("/approve/:id", authHandler.ApproveUser)
		admin.GET("/pending-users", authHandler.GetPendingUsers)
		admin.GET("/approved-users", authHandler.GetApprovedUsers)
		admin.GET("/login-logs", authHandler.GetLoginLogs)
		admin.GET("/admin-logs", authHandler.GetAdminLogs)
		admin.GET("/login-logs/csv", authHandler.GetLoginLogsCSV)
		admin.GET("/admin-logs/csv", authHandler.GetAdminLogsCSV)

		admin.GET("/bods", bodHandler.GetAllBods)
		admin.POST("/bods", bodHandler.CreateBod)
		admin.PUT("/bods/:id", bodHandler.UpdateBod)
		admin.DELETE("/bods/:id", bodHandler.DeleteBod)

		admin.GET("/managements", managementHandler.GetAllMgteams)
		admin.POST("/managements", managementHandler.CreateMgTeam)
		admin.PUT("/managements/:id", managementHandler.UpdateMgTeam)
		admin.DELETE("/managements/:id", managementHandler.DeleteMgTeam)

		admin.GET("/branches", branchHandler.GetAllBranchesAdmin)
		admin.POST("/branches", branchHandler.CreateBranch)
		admin.PUT("/branches/:id", branchHandler.UpdateBranch)
		admin.DELETE("/branches/:id", branchHandler.DeleteBranch)

		admin.GET("/services", serviceHandler.GetAllServices)
		admin.POST("/services", serviceHandler.CreateService)
		admin.PUT("/services/:id", serviceHandler.UpdateService)
		admin.DELETE("/services/:id", serviceHandler.DeleteService)

		admin.GET("/about/messages", aboutHandler.AdminGetMessages)
		admin.POST("/about/messages", aboutHandler.AdminCreateMessage)
		admin.PUT("/about/messages/:id", aboutHandler.AdminUpdateMessage)
		admin.DELETE("/about/messages/:id", aboutHandler.AdminDeleteMessage)

		admin.GET("/about/vision", aboutHandler.AdminGetAboutVision)
		admin.POST("/about/vision", aboutHandler.AdminCreateAboutVision)
		admin.PUT("/about/vision", aboutHandler.AdminUpdateAboutVision)
		admin.DELETE("/about/vision/:id", aboutHandler.AdminDeleteAboutVision)

		admin.GET("/about/stats", aboutHandler.AdminGetStats)
		admin.POST("/about/stats", aboutHandler.AdminCreateStat)
		admin.PUT("/about/stats/:id", aboutHandler.AdminUpdateStat)
		admin.DELETE("/about/stats/:id", aboutHandler.AdminDeleteStat)

		// --- About Section Management ---
admin.POST("/about/slides", aboutHandler.AdminUploadSlideImage) // Upload slide images
admin.GET("/about/slides", aboutHandler.AdminGetSlides)             // (Optional) Get all slides
admin.DELETE("/about/slides/:id", aboutHandler.AdminDeleteSlide)       // (Optional) Delete a slide image

admin.POST("/about/ceo/upload", aboutHandler.AdminUploadCEOImage)      // Upload CEO image
admin.PUT("/about/ceo", aboutHandler.AdminUpdateCEOInfo)               // Update CEO name/description
admin.GET("/about/ceo", aboutHandler.GetCEOInfo)                       // Public fetch of CEO info


		admin.GET("/products", productHandler.GetAllProducts)
		admin.POST("/products", productHandler.CreateProduct)
		admin.PUT("/products/:id", productHandler.UpdateProduct)
		admin.DELETE("/products/:id", productHandler.DeleteProduct)

		admin.GET("/base-rates", baseRateHandler.GetAllBaseRates)
		admin.POST("/base-rates", baseRateHandler.CreateBaseRate)
		admin.PUT("/base-rates/:id", baseRateHandler.UpdateBaseRate)
		admin.DELETE("/base-rates/:id", baseRateHandler.DeleteBaseRate)

		admin.GET("/saving-interest-rates", savingInterestRateHandler.GetAllSavingRates)
		admin.POST("/saving-interest-rates", savingInterestRateHandler.CreateSavingRate)
		admin.PUT("/saving-interest-rates/:id", savingInterestRateHandler.UpdateSavingRate)
		admin.DELETE("/saving-interest-rates/:id", savingInterestRateHandler.DeleteSavingRate)

		admin.GET("/loan-interest-rates", loanInterestHandler.GetAllLoanInterestRates)
		admin.GET("/loan-interest-rates/:id", loanInterestHandler.GetLoanInterestRateByID)
		admin.POST("/loan-interest-rates", loanInterestHandler.CreateLoanInterestRate)
		admin.PUT("/loan-interest-rates/:id", loanInterestHandler.UpdateLoanInterestRate)
		admin.DELETE("/loan-interest-rates/:id", loanInterestHandler.DeleteLoanInterestRate)

		admin.GET("/financial-reports", financialReportHandler.GetAllFinancialReports)
		admin.POST("/financial-reports", financialReportHandler.CreateFinancialReport)
		admin.PUT("/financial-reports/:id", financialReportHandler.UpdateFinancialReport)
		admin.DELETE("/financial-reports/:id", financialReportHandler.DeleteFinancialReport)

		admin.GET("/annual-reports", annualReportHandler.GetAllAnnualReports)
		admin.POST("/annual-reports", annualReportHandler.CreateAnnualReport)
		admin.PUT("/annual-reports/:id", annualReportHandler.UpdateAnnualReport)
		admin.DELETE("/annual-reports/:id", annualReportHandler.DeleteAnnualReport)

admin.GET("/principal-indicators", principalIndicatorHandler.GetAllIndicators)
admin.POST("/principal-indicators", principalIndicatorHandler.CreateIndicator)
admin.PUT("/principal-indicators/:id", principalIndicatorHandler.UpdateIndicator)
admin.DELETE("/principal-indicators/:id", principalIndicatorHandler.DeleteIndicator)

admin.GET("/sebon-disclosures", sebonHandler.GetAllDisclosures)
admin.POST("/sebon-disclosures", sebonHandler.CreateDisclosure)
admin.PUT("/sebon-disclosures/:id", sebonHandler.UpdateDisclosure)
admin.DELETE("/sebon-disclosures/:id", sebonHandler.DeleteDisclosure)

admin.GET("/staff-training-reports", staffHandler.GetAllAdminStaffTrainingReports)
admin.POST("/staff-training-reports", staffHandler.CreateStaffTrainingReports)
admin.PUT("/staff-training-reports/:id", staffHandler.UpdateStaffTrainingReports)
admin.DELETE("/staff-training-reports/:id", staffHandler.DeleteStaffTrainingReports)

admin.GET("/notices", noticeHandler.GetAllNotices)
admin.POST("/notices", noticeHandler.CreateNotice)
admin.PUT("/notices/:id", noticeHandler.UpdateNotice)
admin.DELETE("/notices/:id", noticeHandler.DeleteNotice)

  admin.GET("/galleries", galleryHandler.GetAllGalleries)
  admin.POST("/galleries/upload", galleryHandler.UploadGalleryImages)
  	admin.PUT("/galleries/:id", galleryHandler.UpdateGallery)
	admin.DELETE("/galleries/:id", galleryHandler.DeleteGallery)

	admin.POST("/success-stories", successstoriesHandler.CreateSuccessStories)
	admin.GET("/success-stories", successstoriesHandler.GetAllSuccessStories)
	admin.PUT("/success-stories/:id", successstoriesHandler.UpdateSuccessStories)
	admin.DELETE("/success-stories/:id", successstoriesHandler.DeleteSuccessStories)

	admin.GET("/footer-downloads", downloadHandler.GetAllDownloads)
admin.POST("/footer-downloads", downloadHandler.CreateDownloads)
admin.DELETE("/footer-downloads/:id", downloadHandler.DeleteDownloads)

admin.GET("/footer-spokespersons", spokespersonHandler.GetAllSpokePerson)
admin.POST("/footer-spokespersons", spokespersonHandler.CreateSpokePerson)
admin.PUT("/footer-spokespersons/:id", spokespersonHandler.UpdateSpokePerson)
admin.DELETE("/footer-spokespersons/:id", spokespersonHandler.DeleteSpokePerson)

admin.GET("/popup-notices", popupNoticeHandler.GetAllPopupNotices)
admin.POST("/popup-notices", popupNoticeHandler.CreatePopupNotice)
admin.PUT("/popup-notices/:id", popupNoticeHandler.UpdatePopupNotice)
admin.DELETE("/popup-notices/:id", popupNoticeHandler.DeletePopupNotice)

admin.POST("/scrolling-notices", scrollingNoticeHandler.CreateScrollingNotice)
admin.GET("/scrolling-notices", scrollingNoticeHandler.GetScrollingNotices)
admin.PUT("/scrolling-notices/:id", scrollingNoticeHandler.UpdateScrollingNotice)
admin.DELETE("/scrolling-notices/:id", scrollingNoticeHandler.DeleteScrollingNotice)


 admin.GET("/head-office-staff", headOfficeStaffHandler.GetAllStaff)
    admin.POST("/head-office-staff", headOfficeStaffHandler.CreateStaff)
    admin.PUT("/head-office-staff/:id", headOfficeStaffHandler.UpdateStaff)
    admin.DELETE("/head-office-staff/:id", headOfficeStaffHandler.DeleteStaff)

	admin.GET("/vacancies", vacancyHandler.GetVacancies)
	admin.POST("/vacancies", vacancyHandler.CreateVacancy)
admin.DELETE("/vacancies/:id", vacancyHandler.DeleteVacancy)

	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port

	log.Printf("🚀 Server running at http://localhost%s", addr)

	// Start server
	server := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}

	/*
	// Start HTTP server
	addr := cfg.Server.Host + ":" + cfg.Server.Port
	log.Printf("🚀 Server running at http://%s", addr)

	server := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("❌ Server error:", err)
	}*/
}

// Helper: returns basic profile data extracted from JWT claims
func getProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	userid, _ := c.Get("userid")
	username, _ := c.Get("username")
	role, _ := c.Get("role")

	c.JSON(http.StatusOK, gin.H{
		"user_id":  userID,
		"userid":   userid,
		"username": username,
		"role":     role,
	})
}

/*
package main

import (
	"log"
	"net/http"
	"slbbl/internal/config"
	"slbbl/internal/database"
	"slbbl/internal/handlers"
	"slbbl/internal/middleware"
	"slbbl/internal/models"
	"slbbl/internal/seed"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load config
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("❌ Failed to load config:", err)
	}

	// Connect to database
	db, err := database.NewDatabase(cfg.GetDSN())
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Seed default admin
	seed.SeedAdminUser(db)

	// Set Gin to release mode in production
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	router := gin.Default()

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // adjust as needed
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve uploaded files (images, etc.)
	router.Static("/uploads", "./uploads")

	uploadPath := "./uploads/financial_reports"
uploadAnnualReportsPath := "./uploads/annual_reports"
router.Static("/uploads/annual_reports", uploadAnnualReportsPath)


	// JWT secret
	jwtSecret := []byte(cfg.JWT.Secret)
	authHandler := handlers.NewAuthHandler(db, jwtSecret)
	bodHandler := handlers.NewBodHandler(db) // ✅ New BOD handler
	managementHandler:=handlers.NewManagementHandler(db)
	branchHandler:=handlers.NewBranchHandler(db)
	serviceHandler:=handlers.NewServiceHandler(db)
	aboutHandler := handlers.NewAboutHandler(db)
	productHandler:=handlers.NewProductHandler(db)
	baserateHanlder:=handlers.NewBaseRateHandler(db)
	savinginterestrateHandler:=handlers.NewSavingInterestHandler(db)
	loanInterestHandler := handlers.NewLoanInterestHandler(db)
	financialReportHandler:=handlers.NewFinancialReportHandler(db,uploadPath)
	annualReportHandler := handlers.NewAnnualReportHandler(db, uploadAnnualReportsPath)



	// Public routes
	public := router.Group("/api/v1")
	public.POST("/register", authHandler.Register)
	public.POST("/login", middleware.RateLimiter(), authHandler.Login)
	public.GET("/bods", bodHandler.GetPublicBods)
	public.GET("/management-team",managementHandler.GetPublicManagement)
	public.GET("/branches",branchHandler.GetAllBranches)
	public.GET("/branches/:province", branchHandler.GetBranchesByProvince)
	public.GET("/services",serviceHandler.GetAllServicesPublic)
	public.GET("/products",productHandler.GetAllProductsPublic)
	public.GET("/base-rates",baserateHanlder.GetAllBaseRatesPublic)
	public.GET("/saving-interest-rates", savinginterestrateHandler.GetAllPublicSavingRates)
	public.GET("/loan-interest-rates",loanInterestHandler.GetAllLoanInterestRatesPublic)
	public.GET("/financial-reports", financialReportHandler.GetAllPublicFinancialReports)
	public.GET("/annual-reports", annualReportHandler.GetAllPublicAnnualReports)

	// ✅ Public About routes
	public.GET("/about/messages", aboutHandler.GetMessages)
	public.GET("/about/vision", aboutHandler.GetAboutVision)
	public.GET("/about/stats", aboutHandler.GetStats)
	public.GET("/about/slides", aboutHandler.GetSlides)

	// Protected routes
	protected := router.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware(jwtSecret))
	protected.GET("/me", getProfile)

	// Admin-only routes
	admin := protected.Group("/admin")
	admin.Use(middleware.RequireRole(string(models.RoleAdmin)))
	admin.PATCH("/approve/:id", authHandler.ApproveUser)
	admin.GET("/pending-users", authHandler.GetPendingUsers)
	admin.GET("/approved-users", authHandler.GetApprovedUsers)
	admin.GET("/login-logs", authHandler.GetLoginLogs)
	admin.GET("/admin-logs", authHandler.GetAdminLogs)
	admin.GET("/login-logs/csv", authHandler.GetLoginLogsCSV)
	admin.GET("/admin-logs/csv", authHandler.GetAdminLogsCSV)

	// ✅ Board of Directors Routes (Admin Only)
	admin.GET("/bods", bodHandler.GetAllBods)
	admin.POST("/bods", bodHandler.CreateBod)
	admin.PUT("/bods/:id", bodHandler.UpdateBod)
	admin.DELETE("/bods/:id", bodHandler.DeleteBod)

	admin.GET("/managements", managementHandler.GetAllMgteams)
	admin.POST("/managements", managementHandler.CreateMgTeam)
	admin.PUT("/managements/:id", managementHandler.UpdateMgTeam)
	admin.DELETE("/managements/:id", managementHandler.DeleteMgTeam)

admin.GET("/branches", branchHandler.GetAllBranchesAdmin)
admin.POST("/branches", branchHandler.CreateBranch)
admin.PUT("/branches/:id", branchHandler.UpdateBranch)
admin.DELETE("/branches/:id", branchHandler.DeleteBranch)

  admin.GET("/services", serviceHandler.GetAllServices)
	admin.POST("/services", serviceHandler.CreateService)
	admin.PUT("/services/:id", serviceHandler.UpdateService)
	admin.DELETE("/services/:id", serviceHandler.DeleteService)

// ✅ Admin About routes
	admin.GET("/about/messages", aboutHandler.AdminGetMessages)
	admin.POST("/about/messages", aboutHandler.AdminCreateMessage)
	admin.PUT("/about/messages/:id", aboutHandler.AdminUpdateMessage)
	admin.DELETE("/about/messages/:id", aboutHandler.AdminDeleteMessage)

	admin.GET("/about/vision", aboutHandler.AdminGetAboutVision)
	admin.POST("/about/vision", aboutHandler.AdminCreateAboutVision)
	admin.PUT("/about/vision/:id", aboutHandler.AdminUpdateAboutVision)
	admin.DELETE("/about/vision/:id", aboutHandler.AdminDeleteAboutVision)

	admin.GET("/about/stats", aboutHandler.AdminGetStats)
	admin.POST("/about/stats", aboutHandler.AdminCreateStat)
	admin.PUT("/about/stats/:id", aboutHandler.AdminUpdateStat)
	admin.DELETE("/about/stats/:id", aboutHandler.AdminDeleteStat)

	admin.GET("/about/slides", aboutHandler.AdminGetSlides)
	admin.POST("/about/slides", aboutHandler.AdminCreateSlide)
	admin.PUT("/about/slides/:id", aboutHandler.AdminUpdateSlide)
	admin.DELETE("/about/slides/:id", aboutHandler.AdminDeleteSlide)

	admin.GET("/products", productHandler.GetAllProducts)
	admin.POST("/products", productHandler.CreateProduct)
	admin.PUT("/products/:id", productHandler.UpdateProduct)
	admin.DELETE("/products/:id", productHandler.DeleteProduct)

	admin.GET("/base-rates",baserateHanlder.GetAllBaseRates)
	admin.POST("/base-rates",baserateHanlder.CreateBaseRate)
	admin.PUT("/base-rates/:id",baserateHanlder.UpdateBaseRate)
	admin.DELETE("/base-rates/:id",baserateHanlder.DeleteBaseRate)

	admin.GET("/saving-interest-rates", savinginterestrateHandler.GetAllSavingRates)
admin.POST("/saving-interest-rates", savinginterestrateHandler.CreateSavingRate)
admin.PUT("/saving-interest-rates/:id", savinginterestrateHandler.UpdateSavingRate)
admin.DELETE("/saving-interest-rates/:id", savinginterestrateHandler.DeleteSavingRate)


admin.GET("/loan-interest-rates", loanInterestHandler.GetAllLoanInterestRates)
admin.GET("/loan-interest-rates/:id", loanInterestHandler.GetLoanInterestRateByID)
admin.POST("/loan-interest-rates", loanInterestHandler.CreateLoanInterestRate)
admin.PUT("/loan-interest-rates/:id", loanInterestHandler.UpdateLoanInterestRate)
admin.DELETE("/loan-interest-rates/:id", loanInterestHandler.DeleteLoanInterestRate)

admin.GET("/financial-reports", financialReportHandler.GetAllFinancialReports)
admin.POST("/financial-reports", financialReportHandler.CreateFinancialReport)
admin.PUT("/financial-reports/:id", financialReportHandler.UpdateFinancialReport)
admin.DELETE("/financial-reports/:id", financialReportHandler.DeleteFinancialReport)


admin.GET("/annual-reports", annualReportHandler.GetAllAnnualReports) 
admin.POST("/annual-reports", annualReportHandler.CreateAnnualReport)
admin.PUT("/annual-reports/:id", annualReportHandler.UpdateAnnualReport)
admin.DELETE("/annual-reports/:id", annualReportHandler.DeleteAnnualReport)

	// Start server
	addr := cfg.Server.Host + ":" + cfg.Server.Port
	log.Printf("🚀 Server running at http://%s", addr)

	server := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("❌ Server error:", err)
	}
}

// Returns basic profile data from JWT claims
func getProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	userid, _ := c.Get("userid")
	username, _ := c.Get("username")
	role, _ := c.Get("role")

	c.JSON(http.StatusOK, gin.H{
		"user_id":  userID,
		"userid":   userid,
		"username": username,
		"role":     role,
	})
}

*/

/*
package main

import (
	"log"
	"net/http"
	"slbbl/internal/config"
	"slbbl/internal/database"
	"slbbl/internal/handlers"
	"slbbl/internal/middleware"
	"slbbl/internal/models"
	"slbbl/internal/seed"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load config
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("❌ Failed to load config:", err)
	}

	// Connect to database
	db, err := database.NewDatabase(cfg.GetDSN())
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Seed default admin
	seed.SeedAdminUser(db)

	// Set Gin to release mode in production
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	router := gin.Default()

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // adjust to frontend host
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve static files (for image uploads)
	router.Static("/uploads", "./uploads")

	// JWT secret
	jwtSecret := []byte(cfg.JWT.Secret)
	authHandler := handlers.NewAuthHandler(db, jwtSecret)

	// Public routes
	public := router.Group("/api/v1")
	public.POST("/register", authHandler.Register)
	public.POST("/login", middleware.RateLimiter(), authHandler.Login)

	// Protected routes
	protected := router.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware(jwtSecret))
	protected.GET("/me", getProfile)

	// Admin-only routes
	admin := protected.Group("/admin")
	admin.Use(middleware.RequireRole(string(models.RoleAdmin)))

	// Auth-related admin routes
	admin.PATCH("/approve/:id", authHandler.ApproveUser)
	admin.GET("/pending-users", authHandler.GetPendingUsers)
	admin.GET("/approved-users", authHandler.GetApprovedUsers)
	admin.GET("/login-logs", authHandler.GetLoginLogs)
	admin.GET("/admin-logs", authHandler.GetAdminLogs)
	admin.GET("/login-logs/csv", authHandler.GetLoginLogsCSV)
	admin.GET("/admin-logs/csv", authHandler.GetAdminLogsCSV)

	// ✅ Board of Directors routes (admin only)
	admin.GET("/bods", handlers.GetAllBods)
	admin.POST("/bods", handlers.CreateBod)
	admin.PUT("/bods/:id", handlers.UpdateBod)
	admin.DELETE("/bods/:id", handlers.DeleteBod)

	// Run server
	addr := cfg.Server.Host + ":" + cfg.Server.Port
	log.Printf("🚀 Server running at http://%s", addr)

	server := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("❌ Server error:", err)
	}
}

// Returns basic profile data from JWT claims
func getProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	userid, _ := c.Get("userid")
	username, _ := c.Get("username")
	role, _ := c.Get("role")

	c.JSON(http.StatusOK, gin.H{
		"user_id":  userID,
		"userid":   userid,
		"username": username,
		"role":     role,
	})
}
*/


