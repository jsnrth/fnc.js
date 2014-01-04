module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          ui: 'tdd',
          reporter: 'dot'
        },
        src: ['test/**/*_test.js']
      }
    }
  });

  grunt.registerTask('test', 'mochaTest');

};
