# Introduction #

This wiki will show you how to add default samples to the interactive sampler found here:
http://code.google.com/apis/ajax/playground/

# Details #

Samples are stored in the samples/ directory in the codebase.  There are four parts to adding samples.


1. The boilerplate HTML.  This is an HTML file that has generic HTML or Javascript code that your samples use.  The point of this is to avoid repetition while writing demos as well as promote consistency among your sample code.  Please try to minimize the number of boilerplate HTML files per Javascript files.  Here's what a boilerplate HTML file looks like: http://code.google.com/p/google-ajax-examples/source/browse/trunk/interactive_samples/samples/boilerplateHTML/ajaxapis.html

2. The Javascript sample code.  This is the code that the developers will actually see and edit.  Here is an example of a file http://code.google.com/p/google-ajax-examples/source/browse/trunk/interactive_samples/samples/js/search/imagesearch/color_restrict.js and what it looks like live http://code.google.com/apis/ajax/playground/#color_restriction

3. The JSON file.  To hook the boilerplate and JS together, as well as specify some meta-data about the samples, you create a JSON file.  Here is an example http://code.google.com/p/google-ajax-examples/source/browse/trunk/interactive_samples/samples/TOC/search_api_samples.js  Here is what the different properties mean:
  * **category**: The category samples will be in.  The format is Category-Subcategory.  A category value of Search API-Cool Samples will have the samples show up in a dropdown in Cool Samples, which will be in a drop down Search API.
  * **samples[.md](.md)**: This is an array of the samples for a category.
    * **boilerplateHTML**: Specifies the path to the boilerplate HTML for a sample.  Path is relative to the base directory of the codebase.
    * **files[.md](.md)**: This is an array of paths for the JS files for the sample.  For now, it only supports one entry.  Down the road, it might support more.  Path is relative to the base directory of the codebase.
    * **sampleName**: The pretty name for the sample.  This is what is displayed in the nav section and titlebar.
    * **tags**: Comma separated string of tags for the sample.  The tags are used by the search bar to find a demo.  The category and sub category for a demo will automatically be added.
    * **docsUrl**: A string URL link to the docs section related to this sample.  This URL is linked to in the nav section, and in the titlebar when looking at a sample.  This overrides the category docsUrl.
  * **docsUrl**: A string URL link to the docs section related to this category.  This URL is linked to in the nav section on the category, and in the titlebar for any samples in this cateogry if they don't have their own individual docsUrl set.
> At the end of the JSON file, there always must be the section of code like this:  if (typeof codeArray != 'undefined' && codeArray.length) { ... etc.  This is how multiple API JSON files can work together.

4. Specify your JSON in the App Engine script, main.py.  There is an array at the top of the file which has paths to the JSON file, and the name of the API.  Only change this if you are adding an API.  http://code.google.com/p/google-ajax-examples/source/browse/trunk/interactive_samples/main.py

5. Run the production preperation script. It may prompt you for a secret token but you can enter anything you like unless you are pushing this to code.google.com. If you are running your own instance, the secret token is not needed. The preperation script creates a directory `../interactive_copy` which is what should be run as the app so
```
python production_preparation.py
cd ../interactive_copy
```
then push to App Engine from the `interactive_copy` directory.

# Examples #
Here is a sample commit that added samples:
http://code.google.com/p/google-ajax-examples/source/detail?r=320