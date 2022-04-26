module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['index.js','Gruntfile.js'],
      tasks: ['jshint']
    },
    nodemon: {
    dev: {
      script: '-L index.js'
    }
}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['watch','nodemon']);
  grunt.registerTask('uglify',['uglify']);

};
