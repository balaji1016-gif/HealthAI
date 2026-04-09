import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all endpoints
                .allowedOrigins("https://health-ai-flame.vercel.app") // Your Vercel URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
http.cors(cors -> cors.configurationSource(request -> {
    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
    corsConfiguration.setAllowedOrigins(java.util.List.of("https://health-ai-flame.vercel.app"));
    corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
    return corsConfiguration;
}));
